import refs from "./refs.js";
const { form, list, more } = refs;
console.log(form, list, more);

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    //зачищаем список отрисовки
    list.innerHTML = "";
    //сбрасываем параметр страницы
    fetchObject.resetPage();
    let query = evt.target.elements.search.value;
    //записываем полученное значение из инпута в свойство объекта с запросом
    fetchObject.setQuery(query);
    //делаем запрос по значению из инпута и отрисовываем первый ответ
    fetchObject.getFetch();
    //открываем кнопку загрузки
    more.classList.remove("is-hidden");
    //зачищаем инпут
    form.reset();
})

const fetchObject = {
    //ключ, полученный при регистрации у pexels.com
    apiKey: "563492ad6f917000010000013ca469bc45984f2ca1a085ba1c5c7c99",
    //статическая неизменяемая часть строки запроса
    baseUrl: "https://api.pexels.com/v1/search",
    //переменная хранит значение, по которому мы ищем картинки

    //console.log(evt.target.elements.search.value);
    //переменная, указывающая порядковый номер набора картинок, который мы сейчас получаем
    page: 1,
    //переменная, указывающая на количество найденных элементов по запросу на одной странцие
    per_page: 3,
    //метод изменения страницы
    query: "",
    setQuery(value) {
        return this.query = value;
    },
    setPage() {
        return this.page += 1;
    },
    resetPage() {
        return this.page = 1;
    },
    getFetch() {
        let queryParams = `?query=${this.query}&page=${this.page}&per_page=${this.per_page}`;
        //готовая строка запроса
        let url = this.baseUrl + queryParams;
        //объект настроек, в котором мы передаем ключ авторизации для запроса согласно документации
        let options = {
            method: "GET",
            headers: {
                Authorization: this.apiKey,
            },
            //body:{}
        };
        //собственно запрос, который будем обрабатывать методами then, потому что он возвращает промис
        fetch(url, options).then((response) => {
            console.log(response);
            return response.json();
        }).then((data) => {
            return data.photos;
        }).then((photos) => {
            generateGallery(photos, list);
            //createButtonLoadMore(list);
        })
    },
    loadMore(button) {
        button.addEventListener("click", () => {
            console.log('загрузить больше');
            this.setPage();
            console.log(this.page);
            this.getFetch();
        });
    },
    //вторая изменяемая часть строки запроса, содержащая параметры согласно документации
};

fetchObject.loadMore(more);
function generateGallery(array, place) {
    const items = array.map((photo) => {
        return `<li><img src=${photo.src.tiny} alt=${photo.src.photographer}></li>`
    }).join("");
    place.insertAdjacentHTML("beforeend", items);
}

function createButtonLoadMore(place) {
    const button = document.createElement("button");
    button.textContent = "More";
    button.classList.add("more");
    place.insertAdjacentElement("afterend", button);

}



