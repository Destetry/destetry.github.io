
document.addEventListener("DOMContentLoaded", () => {

    const interactiveCards = document.querySelectorAll(
        ".interest-card, .software-card"
    );

    interactiveCards.forEach(card => {

        const isInterest = card.classList.contains("interest-card");
        const section = card.closest(".cv-section");

        if (!section) return;

        const interactionRoot = isInterest
            ? card.closest(".interests-container")
            : section;

        const descriptionBox = isInterest
            ? interactionRoot?.querySelector(".interest-description")
            : section.querySelector(".software-description");

        if (!interactionRoot || !descriptionBox) return;

        const descriptionTitle = descriptionBox.querySelector("h3");
        const descriptionText = descriptionBox.querySelector("p");

        if (!descriptionTitle || !descriptionText) return;

        const showDescription = () => {
            descriptionTitle.textContent = card.dataset.title || "";
            descriptionText.textContent = card.dataset.description || "";

            descriptionBox.classList.add("active");
        };

        const hideDescription = () => {
            descriptionBox.classList.remove("active");
        };

        card.addEventListener("mouseenter", showDescription);
        card.addEventListener("focus", showDescription);
        card.addEventListener("click", showDescription);

        interactionRoot.addEventListener("mouseleave", hideDescription);

        interactionRoot.addEventListener("focusout", event => {
            if (!interactionRoot.contains(event.relatedTarget)) {
                hideDescription();
            }
        });

    });

});
