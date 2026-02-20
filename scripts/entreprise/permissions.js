/***************************************************************
 * FICHIER : scripts/entreprise/permissions.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Permissions entreprise
 * DESCRIPTION :
 *   - Chargement des grades
 *   - Chargement des permissions
 *   - Modification en temps réel
 *   - Sauvegarde
 * AUTEUR : Stephen
 ***************************************************************/

let currentEntrepriseId = null;
let permissionsData = {};   // { grade_id: { perm1: true, perm2: false } }

/***************************************************************
 * INITIALISATION
 ***************************************************************/
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    currentEntrepriseId = params.get("id");

    if (!currentEntrepriseId) {
        alert("Aucune entreprise sélectionnée.");
        return;
    }

    loadPermissions();
});

/***************************************************************
 * CHARGEMENT DES PERMISSIONS
 ***************************************************************/
function loadPermissions() {
    google.script.run
        .withSuccessHandler(data => {
            permissionsData = data;
            renderPermissions();
        })
        .withFailureHandler(err => console.error(err))
        .getEntreprisePermissions(currentEntrepriseId);
}

/***************************************************************
 * AFFICHAGE DES PERMISSIONS
 ***************************************************************/
function renderPermissions() {
    const container = document.getElementById("permissions-container");
    container.innerHTML = "";

    Object.keys(permissionsData).forEach(gradeId => {
        const grade = permissionsData[gradeId];

        const block = document.createElement("div");
        block.className = "permission-block";

        block.innerHTML = `
            <h3>${grade.grade_nom}</h3>
            <div class="perm-list">
                ${Object.keys(grade.perms).map(perm => `
                    <label class="perm-item">
                        <input type="checkbox"
                               data-grade="${gradeId}"
                               data-perm="${perm}"
                               ${grade.perms[perm] ? "checked" : ""}>
                        ${perm}
                    </label>
                `).join("")}
            </div>
        `;

        container.appendChild(block);
    });

    // Ajout des listeners
    document.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", e => {
            const grade = e.target.dataset.grade;
            const perm = e.target.dataset.perm;
            permissionsData[grade].perms[perm] = e.target.checked;
        });
    });
}

/***************************************************************
 * SAUVEGARDE
 ***************************************************************/
function savePermissions() {
    google.script.run
        .withSuccessHandler(() => {
            alert("Permissions mises à jour.");
        })
        .withFailureHandler(err => console.error(err))
        .updateEntreprisePermissions(currentEntrepriseId, permissionsData);
}