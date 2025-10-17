import express from "express"; import cors from "cors";
const app = express(); app.use(cors()); app.use(express.json());
app.options("/api/warriorbot", (_,res)=>res.sendStatus(200));
app.post("/api/warriorbot", async (req,res)=>{ try{
  const k=process.env.OPENAI_API_KEY; if(!k) return res.status(500).json({error:"Missing OPENAI_API_KEY"});
  const {model="gpt-4o-mini",system="You are WarriorBot",history=[],message="Hello"}=req.body||{};
  const msgs=[{role:"system",content:system},...history.map(h=>({role:h.sender==="user"?"user":"assistant",content:h.message})).slice(-6),{role:"user",content:String(message)}];
  const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${k}`,"Content-Type":"application/json"},body:JSON.stringify({model:model,messages:msgs,temperature:0.7,max_tokens:700})});
  const d=await r.json(); if(!r.ok) return res.status(r.status).json({error:d.error||"OpenAI error"}); res.json({reply:d.choices?.[0]?.message?.content||""});
}catch(e){res.status(500).json({error:"Proxy failure",details:e?.message})}});
app.listen(8787, ()=>console.log("Proxy at http://127.0.0.1:8787/api/warriorbot"));
