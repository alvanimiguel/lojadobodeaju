const WHATSAPP_NUMBER = "5579988653380";

const productsGrid = document.getElementById("products-container");
const themeToggle = document.getElementById("theme-toggle");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

/* TEMA - Escuro como padrão */
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        themeToggle.textContent = "🌙";
    } else {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
        themeToggle.textContent = "☀️";
    }
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
    
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
    }
});

initTheme();

/* MENU MOBILE */
menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });
});

document.addEventListener("click", (e) => {
    if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove("active");
    }
});

/* FORMATAR PREÇO */
function formatPrice(price) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

/* FORMATAR DESCRIÇÃO - Converte \n em <br> */
function formatDescription(text) {
    if (!text) return "";
    return text.replace(/\n/g, "<br>");
}

/* LINK WHATSAPP */
function createWhatsAppLink(product) {
    let message = `Olá! 👋\n\nTenho interesse no seguinte produto:\n\n`;
    message += `🛍️ *Produto:* ${product.nome}\n`;
    
    if (product.preco_promocional && product.preco_promocional < product.preco) {
        message += `💰 *Preço Promocional:* ${formatPrice(product.preco_promocional)}\n`;
        message += `💵 *Preço Original:* ${formatPrice(product.preco)} (R$ ${(product.preco - product.preco_promocional).toFixed(2)} de desconto!)\n`;
    } else {
        message += `💰 *Preço:* ${formatPrice(product.preco)}\n`;
    }
    
    if (product.descricao) {
        message += `\n📝 *Descrição:* ${product.descricao}\n`;
    }
    
    message += `\nGostaria de saber mais informações e disponibilidade.`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/* CRIAÇÃO DO GALERIA DE IMAGENS */
function createGallery(images) {
    const container = document.createElement("div");
    container.classList.add("product-image-container");
    
    const gallery = document.createElement("div");
    gallery.classList.add("product-gallery");
    
    // Adiciona cada imagem como um slide
    images.forEach((src, index) => {
        const slide = document.createElement("div");
        slide.classList.add("product-slide");
        
        const img = document.createElement("img");
        img.classList.add("product-image");
        img.src = src;
        img.alt = `Imagem ${index + 1}`;
        img.loading = "lazy";
        img.decoding = "async";
        
        img.onerror = () => {
            img.src = "https://via.placeholder.com/800x800?text=Imagem+indisponível";
        };
        
        slide.appendChild(img);
        gallery.appendChild(slide);
    });
    
    container.appendChild(gallery);
    
    // Navegação se houver mais de 1 imagem
    if (images.length > 1) {
        // Botão anterior
        const prevBtn = document.createElement("button");
        prevBtn.classList.add("gallery-nav", "gallery-prev");
        prevBtn.textContent = "‹";
        prevBtn.setAttribute("aria-label", "Imagem anterior");
        
        // Botão próximo
        const nextBtn = document.createElement("button");
        nextBtn.classList.add("gallery-nav", "gallery-next");
        nextBtn.textContent = "›";
        nextBtn.setAttribute("aria-label", "Próxima imagem");
        
        // Indicadores
        const dots = document.createElement("div");
        dots.classList.add("gallery-dots");
        
        let currentSlide = 0;
        
        images.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("gallery-dot");
            if (index === 0) dot.classList.add("active");
            
            dot.addEventListener("click", () => {
                goToSlide(index);
            });
            
            dots.appendChild(dot);
        });
        
        function goToSlide(index) {
            currentSlide = index;
            gallery.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Atualiza dots
            const allDots = dots.querySelectorAll(".gallery-dot");
            allDots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentSlide);
            });
        }
        
        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentSlide = (currentSlide - 1 + images.length) % images.length;
            goToSlide(currentSlide);
        });
        
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentSlide = (currentSlide + 1) % images.length;
            goToSlide(currentSlide);
        });
        
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
        container.appendChild(dots);
    }
    
    return container;
}

/* CRIAÇÃO DO CARD */
function createProductCard(product) {
    const card = document.createElement("article");
    card.classList.add("product-card");

    // IMAGENS
    let images = [];
    
    if (product.imagens && Array.isArray(product.imagens) && product.imagens.length > 0) {
        images = product.imagens;
    } else if (product.imagem) {
        images = [product.imagem];
    } else {
        images = ["https://via.placeholder.com/800x800?text=Imagem+indisponível"];
    }
    
    const gallery = createGallery(images);

    // SELO OFERTA
    if (product.preco_promocional && product.preco_promocional < product.preco) {
        const saleBadge = document.createElement("span");
        saleBadge.classList.add("sale-badge");
        saleBadge.textContent = "OFERTA";
        gallery.appendChild(saleBadge);
    }

    // SELO IA
    if (product.imagem_ia === true && product.selo_ia) {
        const aiBadge = document.createElement("div");
        aiBadge.classList.add("ai-badge");
        aiBadge.textContent = product.selo_ia;
        gallery.appendChild(aiBadge);
    }

    // CONTEÚDO
    const content = document.createElement("div");
    content.classList.add("product-info");

    // Nome
    const name = document.createElement("h3");
    name.classList.add("product-name");
    name.textContent = product.nome;

    // Descrição (com quebras de linha)
    const description = document.createElement("p");
    description.classList.add("product-description");
    description.innerHTML = formatDescription(product.descricao);

    // PREÇO
    const priceContainer = document.createElement("div");
    priceContainer.classList.add("product-price-area");

    if (product.preco_promocional && product.preco_promocional < product.preco) {
        const oldPrice = document.createElement("span");
        oldPrice.classList.add("price-normal");
        oldPrice.textContent = formatPrice(product.preco);
        priceContainer.appendChild(oldPrice);

        const currentPrice = document.createElement("span");
        currentPrice.classList.add("price");
        currentPrice.textContent = formatPrice(product.preco_promocional);
        priceContainer.appendChild(currentPrice);
    } else {
        const currentPrice = document.createElement("span");
        currentPrice.classList.add("price");
        currentPrice.textContent = formatPrice(product.preco);
        priceContainer.appendChild(currentPrice);
    }

    // BOTÃO
    const buyButton = document.createElement("a");
    buyButton.classList.add("product-buy");
    buyButton.textContent = product.disponivel ? "Comprar pelo WhatsApp" : "Produto indisponível";

    if (product.disponivel) {
        buyButton.href = createWhatsAppLink(product);
        buyButton.target = "_blank";
        buyButton.rel = "noopener noreferrer";
    } else {
        buyButton.classList.add("disabled");
        buyButton.setAttribute("aria-disabled", "true");
        buyButton.setAttribute("tabindex", "-1");
    }

    // MONTAGEM
    content.appendChild(name);
    content.appendChild(description);
    content.appendChild(priceContainer);
    content.appendChild(buyButton);

    card.appendChild(gallery);
    card.appendChild(content);

    return card;
}

/* CARREGAR PRODUTOS */
async function loadProducts() {
    try {
        const response = await fetch("./products.json");
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const products = await response.json();
        productsGrid.innerHTML = "";

        if (!Array.isArray(products) || products.length === 0) {
            productsGrid.innerHTML = `
                <div class="products-loading">
                    <p>📦 Nenhum produto disponível no momento.</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            productsGrid.appendChild(createProductCard(product));
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        productsGrid.innerHTML = `
            <div class="products-loading">
                <p>❌ Não foi possível carregar os produtos.</p>
            </div>
        `;
    }
}

/* INICIALIZAÇÃO */
loadProducts();

document.getElementById("current-year").textContent = new Date().getFullYear();
