/* =========================================================
   STOCKPRO
   Gestion complète du stock, ventes, dettes et reçus
========================================================= */


/* =========================================================
   STOCKAGE
========================================================= */

let produits = JSON.parse(
    localStorage.getItem("stockproProduits") ||
    localStorage.getItem("produits") ||
    "[]"
);

let ventes = JSON.parse(
    localStorage.getItem("stockproVentes") ||
    localStorage.getItem("ventes") ||
    "[]"
);

let entrees = JSON.parse(
    localStorage.getItem("stockproEntrees") ||
    localStorage.getItem("entrees") ||
    "[]"
);

let dettes = JSON.parse(
    localStorage.getItem("stockproDettes") ||
    localStorage.getItem("dettes") ||
    "[]"
);

let remboursements = JSON.parse(
    localStorage.getItem("stockproRemboursements") ||
    localStorage.getItem("remboursements") ||
    "[]"
);


let boutique = JSON.parse(
    localStorage.getItem("stockproBoutique") ||
    "null"
);


if (!boutique) {

    boutique = {

        nom: "HAJARA STORE",

        telephone: "772818149",

        telephone2: "704243828",

        adresse: "Rufisque, Sénégal",

        slogan: "Gestion simple. Vision professionnelle."

    };

}


/* =========================================================
   SAUVEGARDE
========================================================= */

function sauvegarder() {

    localStorage.setItem(
        "stockproProduits",
        JSON.stringify(produits)
    );

    localStorage.setItem(
        "stockproVentes",
        JSON.stringify(ventes)
    );

    localStorage.setItem(
        "stockproEntrees",
        JSON.stringify(entrees)
    );

    localStorage.setItem(
        "stockproDettes",
        JSON.stringify(dettes)
    );

    localStorage.setItem(
        "stockproRemboursements",
        JSON.stringify(remboursements)
    );

    localStorage.setItem(
        "stockproBoutique",
        JSON.stringify(boutique)
    );

}


/* =========================================================
   OUTILS
========================================================= */

function argent(nombre) {

    return Number(nombre || 0)
        .toLocaleString("fr-FR") + " F";

}


function dateHeure() {

    const maintenant = new Date();

    return {

        date: maintenant.toLocaleDateString(
            "fr-FR"
        ),

        heure: maintenant.toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        )

    };

}


/* =========================================================
   DATE / HEURE ACTUELLE
========================================================= */

function afficherDateHeure() {

    const date = document.getElementById(
        "dateActuelle"
    );

    const heure = document.getElementById(
        "heureActuelle"
    );

    if (!date || !heure) return;

    const maintenant = new Date();

    date.textContent =
        maintenant.toLocaleDateString(
            "fr-FR",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    heure.textContent =
        maintenant.toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}

setInterval(
    afficherDateHeure,
    1000
);

afficherDateHeure();


/* =========================================================
   STATISTIQUES
========================================================= */

function afficherStatistiques() {

    const totalProduits =
        document.getElementById(
            "totalProduits"
        );

    const stockFaible =
        document.getElementById(
            "stockFaible"
        );

    const totalVentes =
        document.getElementById(
            "totalVentes"
        );

    const totalBenefice =
        document.getElementById(
            "totalBenefice"
        );

    const totalDettes =
        document.getElementById(
            "totalDettes"
        );


    if (totalProduits) {

        totalProduits.textContent =
            produits.length;

    }


    const faibles =
        produits.filter(
            p =>
                Number(p.quantite) <=
                Number(p.stockMinimum)
        );


    if (stockFaible) {

        stockFaible.textContent =
            faibles.length;

    }


    const chiffre =
        ventes.reduce(
            (total, vente) =>
                total +
                Number(vente.total || 0),
            0
        );


    if (totalVentes) {

        totalVentes.textContent =
            argent(chiffre);

    }


    const benefice =
        ventes.reduce(
            (total, vente) =>
                total +
                Number(vente.benefice || 0),
            0
        );


    if (totalBenefice) {

        totalBenefice.textContent =
            argent(benefice);

    }


    const detteTotal =
        dettes.reduce(
            (total, dette) =>
                total +
                Number(dette.reste || 0),
            0
        );


    if (totalDettes) {

        totalDettes.textContent =
            argent(detteTotal);

    }


    const totalDettesSection =
        document.getElementById(
            "totalDettesSection"
        );


    if (totalDettesSection) {

        totalDettesSection.textContent =
            argent(detteTotal);

    }

}


/* =========================================================
   PRODUITS
========================================================= */

function afficherProduits() {

    const liste =
        document.getElementById(
            "listeProduits"
        );

    if (!liste) return;

    const recherche =
        document.getElementById(
            "recherche"
        )?.value
        ?.toLowerCase()
        .trim() || "";


    liste.innerHTML = "";


    produits
        .filter(
            produit =>
                produit.nom
                    .toLowerCase()
                    .includes(recherche)
        )
        .forEach(
            (produit, index) => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                const etat =
                    Number(produit.quantite) <=
                    Number(produit.stockMinimum)
                        ? "⚠️ Faible"
                        : "✅ Normal";


                tr.innerHTML = `

                    <td>
                        ${produit.nom}
                    </td>

                    <td>
                        ${produit.categorie || "-"}
                    </td>

                    <td>
                        ${produit.quantite}
                    </td>

                    <td>
                        ${argent(produit.prixVente)}
                    </td>

                    <td>
                        ${produit.date || "-"}
                        <br>
                        ${produit.heure || ""}
                    </td>

                    <td>
                        ${etat}
                    </td>

                    <td>

                        <button
                            onclick="modifierProduit(${index})"
                        >
                            ✏️
                        </button>

                        <button
                            onclick="supprimerProduit(${index})"
                        >
                            🗑️
                        </button>

                    </td>

                `;

                liste.appendChild(tr);

            }
        );

}


/* =========================================================
   AJOUTER / MODIFIER PRODUIT
========================================================= */

function viderFormulaireProduit() {

    [
        "nom",
        "categorie",
        "prixAchat",
        "prixVente",
        "quantite",
        "stockMinimum"
    ]
    .forEach(
        id => {

            const champ =
                document.getElementById(id);

            if (champ) {
                champ.value = "";
            }

        }
    );

}


let indexProduitModification = -1;


function enregistrerProduit() {

    const nom =
        document.getElementById(
            "nom"
        )?.value.trim();

    const categorie =
        document.getElementById(
            "categorie"
        )?.value.trim();

    const prixAchat =
        Number(
            document.getElementById(
                "prixAchat"
            )?.value
        );

    const prixVente =
        Number(
            document.getElementById(
                "prixVente"
            )?.value
        );

    const quantite =
        Number(
            document.getElementById(
                "quantite"
            )?.value
        );

    const stockMinimum =
        Number(
            document.getElementById(
                "stockMinimum"
            )?.value
        );


    if (!nom) {

        alert(
            "Veuillez entrer le nom du produit."
        );

        return;

    }


    const maintenant =
        dateHeure();


    if (
        indexProduitModification >= 0
    ) {

        produits[
            indexProduitModification
        ].nom = nom;

        produits[
            indexProduitModification
        ].categorie = categorie;

        produits[
            indexProduitModification
        ].prixAchat = prixAchat;

        produits[
            indexProduitModification
        ].prixVente = prixVente;

        produits[
            indexProduitModification
        ].quantite = quantite;

        produits[
            indexProduitModification
        ].stockMinimum = stockMinimum;

        indexProduitModification = -1;

    }

    else {

        produits.push({

            nom,

            categorie,

            prixAchat,

            prixVente,

            quantite,

            stockMinimum,

            date: maintenant.date,

            heure: maintenant.heure

        });

    }


    sauvegarder();

    afficherProduits();

    afficherStatistiques();

    remplirSelects();

    viderFormulaireProduit();

}


/* =========================================================
   MODIFIER PRODUIT
========================================================= */

function modifierProduit(index) {

    const produit =
        produits[index];

    if (!produit) return;


    document.getElementById(
        "nom"
    ).value = produit.nom || "";

    document.getElementById(
        "categorie"
    ).value =
        produit.categorie || "";

    document.getElementById(
        "prixAchat"
    ).value =
        produit.prixAchat || 0;

    document.getElementById(
        "prixVente"
    ).value =
        produit.prixVente || 0;

    document.getElementById(
        "quantite"
    ).value =
        produit.quantite || 0;

    document.getElementById(
        "stockMinimum"
    ).value =
        produit.stockMinimum || 0;


    indexProduitModification =
        index;


    const formulaire =
        document.getElementById(
            "formProduit"
        );

    if (formulaire) {

        formulaire.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   SUPPRIMER PRODUIT
========================================================= */

function supprimerProduit(index) {

    if (
        !confirm(
            "Voulez-vous vraiment supprimer ce produit ?"
        )
    ) return;


    produits.splice(
        index,
        1
    );


    sauvegarder();

    afficherProduits();

    afficherStatistiques();

    remplirSelects();

}


/* =========================================================
   SELECTS PRODUITS
========================================================= */

function remplirSelects() {

    const entree =
        document.getElementById(
            "produitEntree"
        );

    const vente =
        document.getElementById(
            "produitVente"
        );


    if (entree) {

        entree.innerHTML =
            `<option value="">
                Choisir un produit
            </option>`;

        produits.forEach(
            (produit, index) => {

                entree.innerHTML += `
                    <option value="${index}">
                        ${produit.nom}
                    </option>
                `;

            }
        );

    }


    if (vente) {

        vente.innerHTML =
            `<option value="">
                Choisir un produit
            </option>`;

        produits.forEach(
            (produit, index) => {

                vente.innerHTML += `
                    <option value="${index}">
                        ${produit.nom}
                    </option>
                `;

            }
        );

    }

}


/* =========================================================
   ENTRÉE DE STOCK
========================================================= */

function enregistrerEntree() {

    const select =
        document.getElementById(
            "produitEntree"
        );

    const quantite =
        Number(
            document.getElementById(
                "quantiteEntree"
            )?.value
        );


    const index =
        Number(select?.value);


    if (
        !select ||
        select.value === "" ||
        !Number.isFinite(quantite) ||
        quantite <= 0
    ) {

        alert(
            "Veuillez choisir un produit et entrer une quantité valide."
        );

        return;

    }


    const produit =
        produits[index];

    if (!produit) return;


    produit.quantite =
        Number(produit.quantite) +
        quantite;


    const maintenant =
        dateHeure();


    entrees.push({

        produit: produit.nom,

        quantite,

        date: maintenant.date,

        heure: maintenant.heure

    });


    sauvegarder();

    afficherProduits();

    afficherStatistiques();

    remplirSelects();


    document.getElementById(
        "quantiteEntree"
    ).value = "";


    alert(
        "Entrée de stock enregistrée."
    );

}


/* =========================================================
   CALCUL VENTE
========================================================= */

function obtenirTotalVente() {

    const index =
        Number(
            document.getElementById(
                "produitVente"
            )?.value
        );

    const quantite =
        Number(
            document.getElementById(
                "quantiteVente"
            )?.value
        );


    const produit =
        produits[index];


    if (!produit || quantite <= 0) {

        return 0;

    }


    return (
        Number(produit.prixVente) *
        quantite
    );

}


/* =========================================================
   CALCUL MONNAIE
========================================================= */

function calculerMonnaieVente() {

    const affichage =
        document.getElementById(
            "monnaieVente"
        );

    if (!affichage) return;


    const total =
        obtenirTotalVente();


    const montantPaye =
        Number(
            document.getElementById(
                "montantPaye"
            )?.value
        ) || 0;


    const difference =
        montantPaye - total;


    if (total <= 0) {

        affichage.innerHTML =
            "💰 Total : 0 F";

        return;

    }


    if (difference > 0) {

        affichage.innerHTML = `
            💰 Total : ${argent(total)}
            <br>
            💵 Monnaie à rendre :
            <strong>
                ${argent(difference)}
            </strong>
        `;

    }

    else if (difference === 0) {

        affichage.innerHTML = `
            💰 Total : ${argent(total)}
            <br>
            ✅ Paiement complet
        `;

    }

    else {

        affichage.innerHTML = `
            💰 Total : ${argent(total)}
            <br>
            ⚠️ Reste à payer :
            <strong>
                ${argent(Math.abs(difference))}
            </strong>
        `;

    }

}


/* =========================================================
   ENREGISTRER VENTE
========================================================= */

function enregistrerVente() {

    const index =
        Number(
            document.getElementById(
                "produitVente"
            )?.value
        );


    const quantite =
        Number(
            document.getElementById(
                "quantiteVente"
            )?.value
        );


    const client =
        document.getElementById(
            "nomClientVente"
        )?.value.trim() ||
        "Client";


    const typePaiement =
        document.getElementById(
            "typePaiement"
        )?.value ||
        "comptant";


    const montantPaye =
        Number(
            document.getElementById(
                "montantPaye"
            )?.value
        ) || 0;


    const produit =
        produits[index];


    if (!produit) {

        alert(
            "Veuillez choisir un produit."
        );

        return;

    }


    if (
        !Number.isFinite(quantite) ||
        quantite <= 0
    ) {

        alert(
            "Veuillez entrer une quantité valide."
        );

        return;

    }


    if (
        Number(produit.quantite) <
        quantite
    ) {

        alert(
            "Stock insuffisant."
        );

        return;

    }


    const total =
        Number(produit.prixVente) *
        quantite;


    const cout =
        Number(produit.prixAchat) *
        quantite;


    const benefice =
        total - cout;


    const monnaie =
        Math.max(
            0,
            montantPaye - total
        );


    const reste =
        Math.max(
            0,
            total - montantPaye
        );


    produit.quantite =
        Number(produit.quantite) -
        quantite;


    const maintenant =
        dateHeure();


    const vente = {

        date: maintenant.date,

        heure: maintenant.heure,

        produit: produit.nom,

        quantite,

        client,

        typePaiement,

        prixUnitaire:
            Number(produit.prixVente),

        total,

        benefice,

        montantPaye,

        monnaie,

        reste

    };


    ventes.push(vente);


    if (reste > 0) {

        dettes.push({

            date: maintenant.date,

            heure: maintenant.heure,

            client,

            produit: produit.nom,

            quantite,

            total,

            paye: montantPaye,

            reste

        });

    }


    sauvegarder();

    afficherProduits();

    afficherStatistiques();

    afficherDettes();

    afficherHistorique();

    dessinerGraphique();


    document.getElementById(
        "quantiteVente"
    ).value = "";

    document.getElementById(
        "nomClientVente"
    ).value = "";

    document.getElementById(
        "montantPaye"
    ).value = "0";


    calculerMonnaieVente();


    alert(
        "Vente enregistrée avec succès."
    );

}


/* =========================================================
   DETTES
========================================================= */

function afficherDettes() {

    const liste =
        document.getElementById(
            "listeDettes"
        );

    if (!liste) return;


    liste.innerHTML = "";


    dettes.forEach(
        (dette, index) => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${dette.date}
                    <br>
                    ${dette.heure}
                </td>

                <td>
                    ${dette.client}
                </td>

                <td>
                    ${dette.produit}
                </td>

                <td>
                    ${dette.quantite}
                </td>

                <td>
                    ${argent(dette.total)}
                </td>

                <td>
                    ${argent(dette.paye)}
                </td>

                <td>
                    ${argent(dette.reste)}
                </td>

                <td>

                    <button
                        onclick="rembourserDette(${index})"
                    >
                        💵 Rembourser
                    </button>

                </td>

            `;


            liste.appendChild(tr);

        }
    );

}


/* =========================================================
   REMBOURSEMENT
========================================================= */

function rembourserDette(index) {

    const dette =
        dettes[index];

    if (!dette) return;


    const montant =
        Number(
            prompt(
                `Reste à payer : ${argent(dette.reste)}\n\nMontant du remboursement :`
            )
        );


    if (
        !Number.isFinite(montant) ||
        montant <= 0
    ) {

        return;

    }


    if (montant > dette.reste) {

        alert(
            "Le remboursement dépasse la dette."
        );

        return;

    }


    dette.paye =
        Number(dette.paye) +
        montant;


    dette.reste =
        Number(dette.reste) -
        montant;


    const maintenant =
        dateHeure();


    remboursements.push({

        client: dette.client,

        produit: dette.produit,

        montant,

        date: maintenant.date,

        heure: maintenant.heure

    });


    if (dette.reste <= 0) {

        dettes.splice(
            index,
            1
        );

    }


    sauvegarder();

    afficherDettes();

    afficherStatistiques();


    alert(
        "Remboursement enregistré."
    );

}


/* =========================================================
   HISTORIQUE
========================================================= */

function afficherHistorique() {

    const historique =
        document.getElementById(
            "historique"
        );

    if (!historique) return;


    historique.innerHTML = "";


    ventes
        .slice()
        .reverse()
        .forEach(
            (vente, indexInverse) => {

                const index =
                    ventes.length -
                    1 -
                    indexInverse;


                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        ${vente.date}
                        <br>
                        ${vente.heure}
                    </td>

                    <td>
                        📤 Vente
                    </td>

                    <td>
                        ${vente.produit}
                    </td>

                    <td>
                        ${vente.quantite}
                    </td>

                    <td>
                        ${argent(vente.total)}
                    </td>

                    <td>
                        ${argent(vente.benefice)}
                    </td>

                    <td>

                        <button
                            onclick="imprimerRecu(${index})"
                        >
                            🧾 Reçu
                        </button>

                    </td>

                `;


                historique.appendChild(tr);

            }
        );


    entrees
        .slice()
        .reverse()
        .forEach(
            entree => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        ${entree.date}
                        <br>
                        ${entree.heure}
                    </td>

                    <td>
                        📥 Entrée
                    </td>

                    <td>
                        ${entree.produit}
                    </td>

                    <td>
                        ${entree.quantite}
                    </td>

                    <td>
                        -
                    </td>

                    <td>
                        -
                    </td>

                    <td>
                        -
                    </td>

                `;


                historique.appendChild(tr);

            }
        );

}


/* =========================================================
   REÇU
========================================================= */

function imprimerRecu(index) {

    const vente =
        ventes[index];

    if (!vente) return;


    const monnaie =
        Number(
            vente.monnaie || 0
        );


    const reste =
        Number(
            vente.reste || 0
        );


    let paiementHTML = "";


    if (monnaie > 0) {

        paiementHTML = `

            <p>
                <strong>
                    Montant reçu :
                </strong>
                ${argent(vente.montantPaye)}
            </p>

            <p style="
                font-size:18px;
                font-weight:bold;
            ">
                💵 MONNAIE À RENDRE :
                ${argent(monnaie)}
            </p>

            <p>
                Reste :
                ${argent(0)}
            </p>

        `;

    }

    else if (reste > 0) {

        paiementHTML = `

            <p>
                <strong>
                    Montant reçu :
                </strong>
                ${argent(vente.montantPaye)}
            </p>

            <p>
                ⚠️ Reste à payer :
                <strong>
                    ${argent(reste)}
                </strong>
            </p>

        `;

    }

    else {

        paiementHTML = `

            <p>
                <strong>
                    Montant reçu :
                </strong>
                ${argent(vente.montantPaye)}
            </p>

            <p>
                ✅ Paiement complet
            </p>

        `;

    }


    const fenetre =
        window.open(
            "",
            "_blank"
        );


    fenetre.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                Reçu - ${boutique.nom}
            </title>

            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    width:
                        360px;

                    margin:
                        30px auto;

                    padding:
                        20px;

                    color:
                        #222;

                }


                .entete {

                    text-align:
                        center;

                    border-bottom:
                        2px solid #222;

                    padding-bottom:
                        15px;

                    margin-bottom:
                        15px;

                }


                .entete h1 {

                    margin:
                        0;

                    font-size:
                        25px;

                }


                .centre {

                    text-align:
                        center;

                }


                .ligne {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    margin:
                        8px 0;

                }


                .total {

                    font-size:
                        20px;

                    font-weight:
                        bold;

                    border-top:
                        2px solid #222;

                    padding-top:
                        10px;

                    margin-top:
                        15px;

                }


                .monnaie {

                    margin-top:
                        20px;

                    padding:
                        12px;

                    border:
                        2px solid #222;

                    font-size:
                        20px;

                    font-weight:
                        bold;

                    text-align:
                        center;

                }


                .footer {

                    text-align:
                        center;

                    margin-top:
                        25px;

                    border-top:
                        1px solid #ccc;

                    padding-top:
                        15px;

                }


                @media print {

                    body {

                        margin:
                            0 auto;

                    }

                }

            </style>

        </head>


        <body>

            <div class="entete">

                <h1>
                    ${boutique.nom}
                </h1>

                <p>
                    ${boutique.slogan}
                </p>

                <p>
                    📞 ${boutique.telephone}
                </p>

                ${
                    boutique.telephone2
                        ? `<p>
                            📞 ${boutique.telephone2}
                           </p>`
                        : ""
                }

                <p>
                    📍 ${boutique.adresse}
                </p>

            </div>


            <div>

                <p>
                    <strong>
                        REÇU DE VENTE
                    </strong>
                </p>

                <p>
                    Date :
                    ${vente.date}
                </p>

                <p>
                    Heure :
                    ${vente.heure}
                </p>

                <p>
                    Client :
                    ${vente.client}
                </p>

            </div>


            <hr>


            <div class="ligne">

                <span>
                    ${vente.produit}
                </span>

                <span>
                    x${vente.quantite}
                </span>

            </div>


            <div class="ligne">

                <span>
                    Prix unitaire
                </span>

                <span>
                    ${argent(vente.prixUnitaire)}
                </span>

            </div>


            <div class="ligne total">

                <span>
                    TOTAL
                </span>

                <span>
                    ${argent(vente.total)}
                </span>

            </div>


            ${paiementHTML}


            <div class="footer">

                <p>
                    Merci pour votre confiance ❤️
                </p>

                <p>
                    À bientôt chez
                    <strong>
                        ${boutique.nom}
                    </strong>
                    ❤️
                </p>

            </div>


            <script>

                window.onload = function() {

                    window.print();

                };

            <\/script>

        </body>

        </html>

    `);


    fenetre.document.close();

}


/* =========================================================
   BOUTIQUE
========================================================= */

function chargerBoutique() {

    const nom =
        document.getElementById(
            "nomBoutique"
        );

    const telephone =
        document.getElementById(
            "telephoneBoutique"
        );

    const telephone2 =
        document.getElementById(
            "telephoneBoutique2"
        );

    const adresse =
        document.getElementById(
            "adresseBoutique"
        );

    const slogan =
        document.getElementById(
            "sloganBoutique"
        );


    if (nom)
        nom.value =
            boutique.nom || "";


    if (telephone)
        telephone.value =
            boutique.telephone || "";


    if (telephone2)
        telephone2.value =
            boutique.telephone2 || "";


    if (adresse)
        adresse.value =
            boutique.adresse || "";


    if (slogan)
        slogan.value =
            boutique.slogan || "";

}


function sauvegarderBoutique() {

    boutique = {

        nom:
            document.getElementById(
                "nomBoutique"
            )?.value.trim() ||
            "HAJARA STORE",

        telephone:
            document.getElementById(
                "telephoneBoutique"
            )?.value.trim() ||
            "",

        telephone2:
            document.getElementById(
                "telephoneBoutique2"
            )?.value.trim() ||
            "",

        adresse:
            document.getElementById(
                "adresseBoutique"
            )?.value.trim() ||
            "",

        slogan:
            document.getElementById(
                "sloganBoutique"
            )?.value.trim() ||
            ""

    };


    localStorage.setItem(
        "stockproBoutique",
        JSON.stringify(boutique)
    );


    alert(
        "Les informations de votre boutique ont été enregistrées."
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function afficherSection(section) {

    const sections = [

        "sectionEntree",

        "sectionVente",

        "sectionDettes",

        "sectionHistorique",

        "sectionBoutique"

    ];


    sections.forEach(
        id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.classList.add(
                    "cache"
                );

            }

        }
    );


    if (section) {

        const element =
            document.getElementById(
                section
            );

        if (element) {

            element.classList.remove(
                "cache"
            );

            element.scrollIntoView({
                behavior: "smooth"
            });

        }

    }

}


/* =========================================================
   GRAPHIQUE
========================================================= */

function dessinerGraphique() {

    const canvas =
        document.getElementById(
            "graphiqueVentes"
        );

    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    const largeur =
        canvas.parentElement
            ?.clientWidth ||
        600;


    canvas.width =
        largeur;


    canvas.height =
        220;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (ventes.length === 0) {

        ctx.font =
            "15px Arial";

        ctx.fillText(
            "Aucune vente enregistrée",
            20,
            40
        );

        return;

    }


    const valeurs =
        ventes
            .slice(-7)
            .map(
                vente =>
                    Number(
                        vente.total || 0
                    )
            );


    const maximum =
        Math.max(
            ...valeurs,
            1
        );


    const marge =
        30;


    const zoneLargeur =
        canvas.width -
        marge * 2;


    const zoneHauteur =
        canvas.height -
        marge * 2;


    ctx.beginPath();


    valeurs.forEach(
        (valeur, index) => {

            const x =
                marge +
                (
                    index /
                    Math.max(
                        valeurs.length - 1,
                        1
                    )
                ) *
                zoneLargeur;


            const y =
                canvas.height -
                marge -
                (
                    valeur /
                    maximum
                ) *
                zoneHauteur;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            }

            else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.stroke();


    valeurs.forEach(
        (valeur, index) => {

            const x =
                marge +
                (
                    index /
                    Math.max(
                        valeurs.length - 1,
                        1
                    )
                ) *
                zoneLargeur;


            const y =
                canvas.height -
                marge -
                (
                    valeur /
                    maximum
                ) *
                zoneHauteur;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

}


/* =========================================================
   ÉVÉNEMENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /* PRODUIT */

        document.getElementById(
            "btnAjouter"
        )?.addEventListener(
            "click",
            function() {

                document.getElementById(
                    "formProduit"
                )?.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );


        document.getElementById(
            "btnEnregistrer"
        )?.addEventListener(
            "click",
            enregistrerProduit
        );


        document.getElementById(
            "btnAnnuler"
        )?.addEventListener(
            "click",
            function() {

                indexProduitModification =
                    -1;

                viderFormulaireProduit();

            }
        );


        document.getElementById(
            "recherche"
        )?.addEventListener(
            "input",
            afficherProduits
        );


        /* ENTRÉE */

        document.getElementById(
            "btnValiderEntree"
        )?.addEventListener(
            "click",
            enregistrerEntree
        );


        document.getElementById(
            "btnAnnulerEntree"
        )?.addEventListener(
            "click",
            function() {

                document.getElementById(
                    "quantiteEntree"
                ).value = "";

            }
        );


        /* VENTE */

        document.getElementById(
            "btnValiderVente"
        )?.addEventListener(
            "click",
            enregistrerVente
        );


        document.getElementById(
            "btnAnnulerVente"
        )?.addEventListener(
            "click",
            function() {

                document.getElementById(
                    "quantiteVente"
                ).value = "";

                document.getElementById(
                    "nomClientVente"
                ).value = "";

                document.getElementById(
                    "montantPaye"
                ).value = "0";

                calculerMonnaieVente();

            }
        );


        document.getElementById(
            "produitVente"
        )?.addEventListener(
            "change",
            calculerMonnaieVente
        );


        document.getElementById(
            "quantiteVente"
        )?.addEventListener(
            "input",
            calculerMonnaieVente
        );


        document.getElementById(
            "montantPaye"
        )?.addEventListener(
            "input",
            calculerMonnaieVente
        );


        /* BOUTIQUE */

        document.getElementById(
            "btnSauverBoutique"
        )?.addEventListener(
            "click",
            sauvegarderBoutique
        );


        /* NAVIGATION */

        document.getElementById(
            "btnAccueil"
        )?.addEventListener(
            "click",
            function() {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        document.getElementById(
            "btnProduits"
        )?.addEventListener(
            "click",
            function() {

                document.getElementById(
                    "listeProduits"
                )?.closest(
                    ".box"
                )?.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );


        document.getElementById(
            "btnEntree"
        )?.addEventListener(
            "click",
            function() {

                afficherSection(
                    "sectionEntree"
                );

            }
        );


        document.getElementById(
            "btnVente"
        )?.addEventListener(
            "click",
            function() {

                afficherSection(
                    "sectionVente"
                );

            }
        );


        document.getElementById(
            "btnDettes"
        )?.addEventListener(
            "click",
            function() {

                afficherSection(
                    "sectionDettes"
                );

            }
        );


        document.getElementById(
            "btnHistorique"
        )?.addEventListener(
            "click",
            function() {

                afficherSection(
                    "sectionHistorique"
                );

            }
        );


        document.getElementById(
            "btnBoutique"
        )?.addEventListener(
            "click",
            function() {

                afficherSection(
                    "sectionBoutique"
                );

                chargerBoutique();

            }
        );


        /* INITIALISATION */

        afficherProduits();

        afficherStatistiques();

        remplirSelects();

        afficherDettes();

        afficherHistorique();

        chargerBoutique();

        dessinerGraphique();

        calculerMonnaieVente();

    }
);
