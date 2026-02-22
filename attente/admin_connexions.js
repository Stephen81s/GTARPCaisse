/***************************************************************
 * FICHIER : admin_connexions.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Panel admin pour gérer les demandes de connexion RP
 *   - Liste les demandes en attente (CONNEXIONS_EN_ATTENTE)
 *   - Boutons : Accepter / Refuser
 *   - Appelle api_approveConnexion()
 ***************************************************************/

console.log("🟦 [admin_connexions] Script chargé.");


/***************************************************************
 * LOG FRONT
 ***************************************************************/
function logAdmin(msg) {
    console.log("🟦 [admin_connexions] " + msg);
}


/***************************************************************
 * CHARGER LES DEMANDES EN ATTENTE
 ***************************************************************/
function loadPendingConnexions() {
    logAdmin("Chargement des demandes en attente…");

    google.script.run
        .withSuccessHandler(displayPendingConnexions)
        .withFailureHandler(err => {
            console.error("❌ [admin_connexions] Erreur API :", err);
            alert("Erreur serveur.");
        })
        .api_getSheet("CONNEXIONS_EN_ATTENTE"); // tu as sûrement déjà une API générique
}


/***************************************************************
 * AFFICHAGE DES DEMANDES
 ***************************************************************/
function displayPendingConnexions(res) {
    if (!res.success) {
        alert("Erreur : " + res.error);
        return;
    }

    const data = res.data;
    const tbody = document.getElementById("pendingConnexionsBody");
    tbody.innerHTML = "";

    data.forEach(row => {
        if (row.status !== "pending") return;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row.id}</td>
            <td>${row.nomRP}</td>
            <td>${row.prenomRP}</td>
            <td>${row.timestamp}</td>
            <td>
                <button class="btn-accept" onclick="approveConnexion(${row.id})">Accepter</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    logAdmin("Demandes affichées.");
}


/***************************************************************
 * VALIDATION ADMIN
 ***************************************************************/
function approveConnexion(demandeId) {
    const adminId = localStorage.getItem("userId");

    if (!adminId) {
        alert("Session admin invalide.");
        return;
    }

    logAdmin(`Validation demande ${demandeId} par admin ${adminId}`);

    google.script.run
        .withSuccessHandler(res => {
            if (!res.success) {
                alert("Erreur : " + res.error);
                return;
            }

            alert("Demande approuvée !");
            loadPendingConnexions();
        })
        .withFailureHandler(err => {
            console.error("❌ [admin_connexions] Erreur API :", err);
            alert("Erreur serveur.");
        })
        .api_approveConnexion(demandeId, adminId);
}