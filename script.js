let produits=JSON.parse(localStorage.getItem("produits")||"[]");
let ventes=JSON.parse(localStorage.getItem("ventes")||"[]");
let produitModifie=null;

function save(){
 localStorage.setItem("produits",JSON.stringify(produits));
 localStorage.setItem("ventes",JSON.stringify(ventes));
}

function vider(){
 ["nom","categorie","prixAchat","prixVente","quantite","stockMinimum"].forEach(id=>document.getElementById(id).value="");
}

function afficherProduits(){
 let liste=document.getElementById("listeProduits");
 liste.innerHTML="";

 produits.forEach((p,i)=>{
  let tr=document.createElement("tr");
  tr.innerHTML=`
   <td>${p.nom}</td>
   <td>${p.categorie}</td>
   <td>${p.quantite}</td>
   <td>${p.prixVente} F</td>
   <td>${p.quantite<=p.stockMinimum?"⚠️ Stock faible":"✅ Disponible"}</td>
   <td>
    <button onclick="modifierProduit(${i})">Modifier</button>
    <button onclick="supprimerProduit(${i})">Supprimer</button>
   </td>`;
  liste.appendChild(tr);
 });

 document.getElementById("totalProduits").textContent=produits.length;
 document.getElementById("stockFaible").textContent=
  produits.filter(p=>p.quantite<=p.stockMinimum).length;
}

document.getElementById("btnAjouter").onclick=function(){
 produitModifie=null;
 document.querySelector("#formProduit h3").textContent="Ajouter un produit";
 vider();
 document.getElementById("formProduit").style.display="block";
};

document.getElementById("btnAnnuler").onclick=function(){
 produitModifie=null;
 document.getElementById("formProduit").style.display="none";
 vider();
};

document.getElementById("btnEnregistrer").onclick=function(){
 let p={
  nom:document.getElementById("nom").value.trim(),
  categorie:document.getElementById("categorie").value.trim(),
  prixAchat:Number(document.getElementById("prixAchat").value)||0,
  prixVente:Number(document.getElementById("prixVente").value)||0,
  quantite:Number(document.getElementById("quantite").value)||0,
  stockMinimum:Number(document.getElementById("stockMinimum").value)||0
 };

 if(!p.nom){
  alert("Veuillez entrer le nom du produit.");
  return;
 }

 if(produitModifie===null) alert("Produit enregistré avec succès !");
 else{
  produits[produitModifie]=p;
  produitModifie=null;
  alert("Produit modifié avec succès !");
 }

 if(produitModifie===null && produits.indexOf(p)===-1) produits.push(p);

 save();
 afficherProduits();
 remplirProduitsEntree();
 remplirProduitsVente();
 vider();
 document.getElementById("formProduit").style.display="none";
};

window.modifierProduit=function(i){
 let p=produits[i];
 produitModifie=i;

 document.getElementById("nom").value=p.nom;
 document.getElementById("categorie").value=p.categorie;
 document.getElementById("prixAchat").value=p.prixAchat;
 document.getElementById("prixVente").value=p.prixVente;
 document.getElementById("quantite").value=p.quantite;
 document.getElementById("stockMinimum").value=p.stockMinimum;

 document.querySelector("#formProduit h3").textContent="Modifier le produit";
 document.getElementById("formProduit").style.display="block";
};

window.supprimerProduit=function(i){
 if(confirm("Voulez-vous vraiment supprimer ce produit ?")){
  produits.splice(i,1);
  save();
  afficherProduits();
  remplirProduitsEntree();
  remplirProduitsVente();
 }
};

document.getElementById("recherche").oninput=function(){
 let r=this.value.toLowerCase();
 document.querySelectorAll("#listeProduits tr").forEach(tr=>{
  tr.style.display=tr.textContent.toLowerCase().includes(r)?"":"none";
 });
};

function remplirProduitsEntree(){
 let s=document.getElementById("produitEntree");
 s.innerHTML='<option value="">Choisir un produit</option>';
 produits.forEach((p,i)=>{
  s.innerHTML+=`<option value="${i}">${p.nom} - Stock : ${p.quantite}</option>`;
 });
}

document.getElementById("btnEntree").onclick=function(){
 document.getElementById("sectionEntree").style.display="block";
 document.getElementById("sectionVente").style.display="none";
 remplirProduitsEntree();
};

document.getElementById("btnAnnulerEntree").onclick=function(){
 document.getElementById("sectionEntree").style.display="none";
};

document.getElementById("btnValiderEntree").onclick=function(){
 let i=document.getElementById("produitEntree").value;
 let q=Number(document.getElementById("quantiteEntree").value);

 if(i===""||q<=0){
  alert("Choisis un produit et indique une quantité.");
  return;
 }

 produits[i].quantite+=q;
 save();
 afficherProduits();
 remplirProduitsEntree();

 document.getElementById("quantiteEntree").value="";
 document.getElementById("sectionEntree").style.display="none";

 alert("Entrée de stock enregistrée !");
};

function remplirProduitsVente(){
 let s=document.getElementById("produitVente");
 s.innerHTML='<option value="">Choisir un produit</option>';
 produits.forEach((p,i)=>{
  s.innerHTML+=`<option value="${i}">${p.nom} - Stock : ${p.quantite}</option>`;
 });
}

document.getElementById("btnVente").onclick=function(){
 document.getElementById("sectionVente").style.display="block";
 document.getElementById("sectionEntree").style.display="none";
 remplirProduitsVente();
};

document.getElementById("btnAnnulerVente").onclick=function(){
 document.getElementById("sectionVente").style.display="none";
};

document.getElementById("btnValiderVente").onclick=function(){
 let i=document.getElementById("produitVente").value;
 let q=Number(document.getElementById("quantiteVente").value);

 if(i===""||q<=0){
  alert("Choisis un produit et indique une quantité.");
  return;
 }

 let p=produits[i];

 if(q>p.quantite){
  alert("Stock insuffisant ! Stock disponible : "+p.quantite);
  return;
 }

 p.quantite-=q;

 ventes.push({
  date:new Date().toLocaleDateString("fr-FR"),
  nom:p.nom,
  quantite:q,
  total:q*p.prixVente,
  benefice:q*(p.prixVente-p.prixAchat)
 });

 save();
 afficherProduits();
 afficherHistorique();
 afficherGraphique();
 remplirProduitsVente();

 document.getElementById("quantiteVente").value="";
 document.getElementById("sectionVente").style.display="none";

 alert("Vente enregistrée !");
};

function afficherHistorique(){
 let h=document.getElementById("historique");
 h.innerHTML="";

 ventes.forEach(v=>{
  h.innerHTML+=`
   <tr>
    <td>${v.date}</td>
    <td>${v.nom}</td>
    <td>${v.quantite}</td>
    <td>${v.total} F</td>
    <td>${v.benefice} F</td>
   </tr>`;
 });

 let total=ventes.reduce((s,v)=>s+v.total,0);
 let benefice=ventes.reduce((s,v)=>s+v.benefice,0);

 document.getElementById("totalVentes").textContent=total+" F";
 document.getElementById("totalBenefice").textContent=benefice+" F";
}

function afficherGraphique(){
 let c=document.getElementById("graphiqueVentes");
 if(!c)return;

 let ctx=c.getContext("2d");
 ctx.clearRect(0,0,c.width,c.height);

 if(!ventes.length){
  ctx.font="16px Arial";
  ctx.fillText("Aucune vente pour le moment",20,60);
  return;
 }

 let max=Math.max(...ventes.map(v=>v.total),1);
 let w=c.width;
 let h=c.height;

 ctx.beginPath();

 ventes.forEach((v,i)=>{
  let x=30+i*((w-60)/Math.max(ventes.length-1,1));
  let y=h-20-(v.total/max)*(h-40);

  if(i===0)ctx.moveTo(x,y);
  else ctx.lineTo(x,y);
 });

 ctx.stroke();

 ventes.forEach((v,i)=>{
  let x=30+i*((w-60)/Math.max(ventes.length-1,1));
  let y=h-20-(v.total/max)*(h-40);

  ctx.beginPath();
  ctx.arc(x,y,4,0,Math.PI*2);
  ctx.fill();

  ctx.font="11px Arial";
  ctx.fillText(v.total+" F",x-15,y-8);
 });
}

document.getElementById("btnAccueil").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
document.getElementById("btnProduits").onclick=()=>document.getElementById("btnAjouter").scrollIntoView({behavior:"smooth"});
document.getElementById("btnHistorique").onclick=()=>document.getElementById("sectionHistorique").scrollIntoView({behavior:"smooth"});

afficherProduits();
remplirProduitsEntree();
remplirProduitsVente();
afficherHistorique();
afficherGraphique();