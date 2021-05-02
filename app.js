const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')

const templateCars = document.getElementById('template-card').content
const templatefooter = document.getElementById('template-footer').content
const templatecarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})



const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data)
        pintarCars(data)

    } catch (error) {
        console.log(error)
    }
}
const pintarCars = data => {
    data.forEach(producto => {
        templateCars.querySelector('h5').textContent = producto.title
        templateCars.querySelector('p').textContent = producto.precio
        templateCars.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCars.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCars.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)

    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        //img: objeto.querySelector('img').getElementById('src'),
        cantidad: 1,
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {
        ...producto
    }
    pintarCarrito()

}

const pintarCarrito = () => {
    //console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templatecarrito.querySelector('th').textContent = producto.id
        templatecarrito.querySelectorAll('td')[0].textContent = producto.cantidad
        templatecarrito.querySelectorAll('td')[1].textContent = producto.title
        templatecarrito.querySelector('.btn-info').dataset.id = producto.id
        templatecarrito.querySelector('.btn-danger').dataset.id = producto.id
        templatecarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templatecarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
    localStorage.setItem('carrito',JSON.stringify(carrito))
}
const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {
        cantidad
    }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {
        cantidad,
        precio
    }) => acc + cantidad * precio, 0)



    templatefooter.querySelectorAll('td')[0].textContent = nCantidad
    templatefooter.querySelector('span').textContent = nPrecio
    const clone = templatefooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()

    })

}
const btnAccion = e => {
    //console.log(e.target)
    if (e.target.classList.contains('btn-info')) {

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {
            ...producto
        }
        pintarCarrito()

    }
    if (e.target.classList.contains('btn-danger')) {

        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}