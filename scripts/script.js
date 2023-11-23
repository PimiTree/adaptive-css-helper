window.addEventListener('DOMContentLoaded', () => {
    const swiper1= new Swiper('.swiper1', {
        loop: true,
        navigation: {
            nextEl: '.coach-photos-next',
            prevEl: '.coach-photos-prev',
        },

    });
    const swiper2= new Swiper('.swiper2', {
        loop: true,
        spaceBetween: 20,
        navigation: {
            nextEl: '.coach-work-next',
            prevEl: '.coach-work-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            993: {
                slidesPerView: 3,
            }
        }
    });

    // modal navigation
    const body = document.body;
    const header = document.querySelector('header');
    const buttons = document.querySelectorAll('button[data-modal]');
    const modal = document.querySelector('.modal-layout');
    const closeButton = modal.querySelector('.fa-xmark');


    const scrollWidth = getScrollWidth();

    let currentModalContent ;

    buttons.forEach(modalButton => {
        modalButton.onclick = openModal;
    })
    modal.onclick = closeModal;
    closeButton.onclick = closeModal;
    body.onkeydown  = closeModal;

    function getScrollWidth() {
        const div = document.createElement('div');
        div.classList.add('divScrollCatcher');
        body.append(div);

        const width = div.offsetWidth - div.clientWidth;
        div.remove();
        return width;
    }
    function openModal(e) {
        modal.classList.remove('hide');
        body.classList.add('holdPageScroll');
        body.style.paddingRight = `${scrollWidth}px`;
        header.style.paddingRight = `${scrollWidth}px`;
        currentModalContent = e.target.dataset.modal;
        modal.querySelector(`[data-content="${currentModalContent}"]`).classList.remove('hide')

    }
    function closeModal(e) {
        const isModalLayout = e.target === modal;
        const isEscButton = e.code === "Escape";
        const isCloseMark = e.target === closeButton;

        if (isCloseMark || isModalLayout || isEscButton)  {
            modal.classList.add('hide');
            body.classList.remove('holdPageScroll');
            body.style.paddingRight = '';
            header.style.paddingRight = '';
            modal.querySelector(`[data-content="${currentModalContent}"]`).classList.add('hide')
        }
    }

    // validate inputs
    const inputs = [...modal.querySelectorAll('input')];
    const submitButton = modal.querySelector('.order-button');
    const isFormValid = [];

    inputs.forEach((input, index)=> {
        input.oninput = validateInputs;
        input.onfocus = validateInputs;
        input.index = index;
        isFormValid.push(false);
    })

    function validateInputs(e, index) {
        if (e.target.name === 'name') {
            e.target.value = e.target.value.replace(/[\d~`@!#$%\^&*+=\-\[\]\';,./{}\(\)|\\":<>_\?]/g, '')
            isFormValid[`${e.target.index}`] = e.target.value.length >= 3;
        }
        if (e.target.name === 'phone') {
            let keyCode;

            e.keyCode && (keyCode = e.keyCode);

            let pos = this.selectionStart;
            if (pos < 3) e.preventDefault();

            let matrix = "+38 (___) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val[i++] || def[i] : a
                });

            i = new_value.indexOf("_");

            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substring(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (e.type == "blur" && this.value.length < 5)  this.value = "";

            !/^\+38 \(/.test(e.target.value) ? e.target.value = '+38 (' : null;
            isFormValid[`${e.target.index}`] = e.target.value.length === matrix.length;
        }
        isFormValid.includes(false) ? submitButton.disabled = true : submitButton.disabled = false;
    }

    //positioning
    const posiotionButton = [...document.querySelectorAll('[data-position]')];

    posiotionButton.forEach(position => {
        position.onclick = (e) => {
            const positionTargetElement = document.querySelector(`[data-target="${e.currentTarget.dataset.position}"]`).getBoundingClientRect().y + window.scrollY - window.innerHeight/2;

            window.scrollTo({
                top: positionTargetElement,
                behavior: "smooth",
            })
            console.log(positionTargetElement)
        }

    })

    //burger
    const burger = document.querySelector('.burger');
    const navigation = document.querySelector('.header__nav');

    const openNavigation = () => {
        navigation.classList.add('menu-in');
        navigation.classList.remove('menu-out');
    }
    const cancelNavigation = () => {
        navigation.classList.add('menu-out');
        navigation.classList.remove('menu-in');
    }

    const toggleEventNavigation = (e) => {
        const burgerCondition = navigation.classList.contains('menu-out') || !navigation.classList.contains('menu-out') && !navigation.classList.contains('menu-in');
        burgerCondition ? openNavigation() :  cancelNavigation();
    };

    const cancelEventNavigation =  (e) => {
        if (!navigation.contains(e.target) && !burger.contains(e.target) && navigation.classList.contains('menu-in')){
            cancelNavigation();
        }
    };

    burger.onclick = toggleEventNavigation;
    body.onclick = cancelEventNavigation;
    body.onscroll = cancelEventNavigation;

})
