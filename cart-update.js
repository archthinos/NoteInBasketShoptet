// Language
function getLanguageFromDomain() {
    var hostname = window.location.hostname;

    if (hostname.endsWith('.sk')) {
        return 'sk';
    } else if (hostname.endsWith('.cz')) {
        return 'cz';
    } else if (hostname.endsWith('.hu')) {
        return 'hu';
    } else {
        return 'en';
    }
}

const translations = {
    sk: {
        placeholder: "Poznámka k produktu...",
        errorNotFound: "Produkt s ID %productId% nebol nájdený.",
        product: "Produkt",
        note: "Poznámka",
        pleaseDoNotDelete: "Prosím, text pod týmto upozornením nemažte. Bez neho nevieme zistiť produktové poznámky ktoré ste zadali."
    },
    cz: {
        placeholder: "Poznámka k produktu...",
        errorNotFound: "Produkt s ID %productId% nebyl nalezen.",
        product: "Produkt",
        note: "Poznámka",
        pleaseDoNotDelete: "Prosím, text pod tímto upozorněním nemažte. Bez něj nevíme zjistit produktové poznámky, které jste zadali."
    },
    hu: {
        placeholder: "Megjegyzés a termékhez...",
        errorNotFound: "A %productId% azonosítójú termék nem található.",
        product: "Termék",
        note: "Megjegyzés",
        pleaseDoNotDelete: "Kérjük, ne törölje ezt a szöveget az alábbi figyelmeztetés után. Enélkül nem tudjuk megállapítani a megadott termékmegjegyzéseket."
    },
    default: {
        placeholder: "Note on the product...",
        errorNotFound: "Product with ID %productId% was not found.",
        product: "Product",
        note: "Note",
        pleaseDoNotDelete: "Please do not delete the text under this warning. Without it, we cannot determine the product notes you have entered."
    }
};


function addTextareaToProducts(products) {
    products.forEach((product, index) => {
        addTextareaToProduct(product.code);
    });
}

function removeProductFromSession(products){
    let productIds = products.map(product => product.code.toString());

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log(key);
        if (!productIds.includes(key)) {
            localStorage.removeItem(key);
            i--;
        }
    }
}

function addTextareaToProduct(productId) {
    var language = getLanguageFromDomain();
    var translation = translations[language] || translations.default;
    var productElement = document.querySelector('tr[data-micro-sku="' + productId + '"]');
    var textarea = document.createElement('textarea');
    var cartImageTd = productElement.querySelector('.main-link');

    textarea.placeholder = translation.placeholder;
    textarea.style= 'resize: none; border: 1px solid #bdc1bd; margin-top: 10px;text-align: start; line-height: 20px;width:calc(100%)';
    textarea.id = `product-note-${productId}`;
    textarea.value = localStorage.getItem(`product-note-${productId}`)

    cartImageTd.insertAdjacentElement('afterend', textarea);

    textarea.addEventListener('change', () => {
        localStorage.setItem("product-note-" + productId, textarea.value);
    });
}

var language = getLanguageFromDomain();
var translation = translations[language] || translations.default;

const remarkTextarea = document.querySelector('textarea[data-testid="remark"]');

if (remarkTextarea) {
    const products = dataLayer[0].shoptet.cart;
    document.getElementById("add-note").checked = true;
    document.getElementById("note").classList.add('visible');

    allNotes = '-----------------------------------------------------------------------------------------------------------\n';
    allNotes += translation.pleaseDoNotDelete + '\n';
    allNotes += '-----------------------------------------------------------------------------------------------------------\n';

    products.forEach((product, index) => {
        note = localStorage.getItem("product-note-" + product.code);
        if(note != null){
           allNotes += translation.product + " " + product.name + "." + translation.note + ":" + note + "\n";
        }
    });
    remarkTextarea.value = allNotes;
}

document.addEventListener('DOMContentLoaded', function() {
    const products = dataLayer[0].shoptet.cart;
    addTextareaToProducts(products);
}, false);


document.addEventListener('ShoptetDOMCartContentLoaded', function () {
    const products = dataLayer[0].shoptet.cart;
    addTextareaToProducts(products);
    removeProductFromSession(products);
}, false);