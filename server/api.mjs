import {products,stores,sizes,milks} from './catalog.mjs';
const encoder=new TextEncoder();
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
const random=()=>hex(crypto.getRandomValues(new Uint8Array(32)));
const digest=async x=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(x)));
async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256));}
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
export async function handleApi(request,db){
 try{
 const url=new URL(request.url),route=url.pathname.replace(/\/$/,''),method=request.method;
 if(['POST','PUT','DELETE','PATCH'].includes(method)){const origin=request.headers.get('origin');if(origin && origin!==url.origin) return json({error:'Origine non autorisée.'},403);}
 const query=(sql,...args)=>db.prepare(sql).bind(...args);
 const cookie=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('coffee_session='))?.slice(15);
 const user=cookie?await query('SELECT u.id,u.email,u.name FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token=? AND s.expires>?',await digest(cookie),Date.now()).first():null;
 const requireUser=()=>{if(!user)fail('Connectez-vous pour continuer.',401);return user;};
 async function body(){const text=await request.text();if(text.length>16000)fail('Requête trop volumineuse.',413);let data;try{data=JSON.parse(text);}catch{fail('Données invalides.');}if(!data||typeof data!=='object'||Array.isArray(data))fail('Données invalides.');return data;}
 async function limit(key,max){const now=Date.now();await query('INSERT INTO attempts (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<? THEN ? ELSE expires END',key,now+900000,now,now,now+900000).run();const row=await query('SELECT count FROM attempts WHERE key=?',key).first();if(row.count>max)fail('Trop de tentatives. Réessayez dans 15 minutes.',429);}
 if(route==='/api/health'&&method==='GET')return json({ok:true});
 if(route==='/api/catalog'&&method==='GET')return json({products,stores,sizes,milks});
 if(route==='/api/me'&&method==='GET'){if(!user)return json({user:null});const row=await query('SELECT COALESCE(SUM(total),0) AS spent FROM orders WHERE user_id=?',user.id).first();return json({user:{...user,stars:Math.floor(row.spent/100)}});}
 if((route==='/api/auth/register'||route==='/api/auth/login')&&method==='POST'){
 const data=await body();const email=String(data.email||'').trim().toLowerCase(),password=String(data.password||'');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)fail('Adresse e-mail invalide.');
 if(password.length<10||password.length>128)fail('Le mot de passe doit contenir entre 10 et 128 caractères.');
 await limit('auth:'+await digest(email),12);
 await limit('ip:'+await digest(request.headers.get('cf-connecting-ip')||'local'),80);
 let account;
 if(route.endsWith('register')){
 const name=String(data.name||'').trim();if(name.length<2||name.length>60)fail('Le prénom doit contenir entre 2 et 60 caractères.');
 if(await query('SELECT id FROM users WHERE email=?',email).first())fail('Cette adresse possède déjà un compte.',409);
 const salt=random();account={id:crypto.randomUUID(),email,name};
 await query('INSERT INTO users (id,email,name,password,created) VALUES (?,?,?,?,?)',account.id,email,name,salt+':'+await passwordHash(password,salt),Date.now()).run();
 }else{
 account=await query('SELECT * FROM users WHERE email=?',email).first();const stored=account?.password||'invalid:invalid';const [salt,expected]=stored.split(':');const actual=await passwordHash(password,salt);let diff=actual.length^expected.length;for(let i=0;i<actual.length;i++)diff|=actual.charCodeAt(i)^(expected.charCodeAt(i)||0);if(!account||diff)fail('E-mail ou mot de passe incorrect.',401);
 }
 const token=random();await query('DELETE FROM sessions WHERE expires<?',Date.now()).run();await query('INSERT INTO sessions (token,user_id,expires) VALUES (?,?,?)',await digest(token),account.id,Date.now()+7*86400000).run();
 return json({user:{id:account.id,name:account.name,email:account.email}},200,{'Set-Cookie':`coffee_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${url.protocol==='https:'?'; Secure':''}`});
 }
 if(route==='/api/auth/logout'&&method==='POST'){if(cookie)await query('DELETE FROM sessions WHERE token=?',await digest(cookie)).run();return json({ok:true},200,{'Set-Cookie':'coffee_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'});}
 if(route==='/api/orders'&&method==='GET'){requireUser();const {results}=await query('SELECT * FROM orders WHERE user_id=? ORDER BY created DESC',user.id).all();return json({orders:results.map(x=>({...x,items:JSON.parse(x.items)}))});}
 if(route==='/api/orders'&&method==='POST'){
 requireUser();const data=await body();if(!stores.some(s=>s.id===data.store))fail('Choisissez un café de démonstration.');if(!Array.isArray(data.items)||data.items.length<1||data.items.length>30)fail('Votre panier est invalide.');
 const items=data.items.map(item=>{if(!item||typeof item!=='object')fail('Article invalide.');const product=products.find(p=>p.id===item.id);if(!product)fail('Produit inconnu.');if(!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>10)fail('Quantité invalide.');const food=['bakery','cookie'].includes(product.kind);if(!Object.hasOwn(sizes,item.size)||!milks.includes(item.milk)||typeof item.extra!=='boolean')fail('Personnalisation invalide.');const unit=product.price+(food?0:sizes[item.size]+(item.milk===milks[0]?0:50)+(item.extra?80:0));return {id:product.id,name:product.name,size:food?'Pièce':item.size,milk:food?'':item.milk,extra:food?false:item.extra,quantity:item.quantity,unit};});
 const total=items.reduce((s,i)=>s+i.unit*i.quantity,0);const id=crypto.randomUUID();const created=Date.now();await query('INSERT INTO orders (id,user_id,items,total,store,created) VALUES (?,?,?,?,?,?)',id,user.id,JSON.stringify(items),total,data.store,created).run();return json({order:{id,items,total,store:data.store,created}},201);
 }
 return json({error:'Route introuvable.'},404);
 }catch(error){if(!error.status)console.error('API error',error.message);return json({error:error.status?error.message:'Le service est momentanément indisponible.'},error.status||500);}
}
