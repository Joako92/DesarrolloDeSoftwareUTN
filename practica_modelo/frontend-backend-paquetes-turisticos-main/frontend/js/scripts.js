const apiUrl = 'http://localhost:3000/paquetes'; // Reemplaza con la URL de tu API

// Función para cargar la grilla de paquetes
function cargarPaquetes() {
    console.log("Cargar paquetes")
    fetch(apiUrl).then(res =>{
        return res.json()
    }).then(data => {
        cargarGrilla(data);
    })
}

function cargarGrilla(data){
    const $tableBody = document.getElementById('lista-paquetes')
    $tableBody.innerHTML = '' //borra la lista que se encuentre cargada previamente

    data.forEach(e => {
        let fila = `
        <tr>
            <td>${e.id}</td>
            <td>${e.destino}</td>
            <td>${e.duracion}</td>
            <td>${e.precio}</td>
            <td>${e.descripcion}</td>
            <td><button onClick="eliminarPaquete(${e.id})">Eliminar</button></td>
        </tr>`

        $tableBody.innerHTML += fila
    });
}
// Función para buscar paquetes por descripción
function buscarPaquetes() {
    let desc = document.getElementById('buscar-input').value
    let url = apiUrl + "/consulta/" + desc
    
    fetch(url).then(res => {
        return res.json()
    }).then(data => {
        cargarGrilla(data)
    })
}

// Función para agregar un nuevo paquete
function agregarPaquete() {
    // Obtener los valores de los campos del formulario
    let id = document.getElementById('id').value;
    let destino = document.getElementById('destino').value;
    let duracion = document.getElementById('duracion').value;
    let precio = document.getElementById('precio').value;
    let descripcion = document.getElementById('descripcion').value;

    // Crear un objeto con los datos del nuevo paquete
    let nuevoPaquete = {
        id: parseInt(id),
        destino: destino,
        duracion: duracion,
        precio: parseFloat(precio),
        descripcion: descripcion
    };

    // Enviar los datos al servidor utilizando fetch() con el método POST
    fetch('http://localhost:3000/agregar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoPaquete)
    }).then(response => {
        if (response.ok) {
            // Si la respuesta es satisfactoria, mostrar mensaje de éxito
            alert('Paquete agregado correctamente');
            cargarPaquetes(); // Actualizar la lista de paquetes
        } else {
            // Si la respuesta indica un error, mostrar un mensaje de error
            alert('Error al agregar el paquete. Por favor, inténtelo de nuevo.');
        }
    }).catch(error => {
        // Si hay un error en la solicitud fetch, puedes manejarlo aquí
        console.error('Error al enviar los datos del paquete al servidor:', error);
        alert('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
    });
}

// Función para eliminar un paquete
function eliminarPaquete(id) {
    const url = `${apiUrl}/${id}`
    fetch(url, { method: 'DELETE' })
        .then(res => {
           return res.json();
        }).then(json => {
            alert(`Destino ${json.destino} eliminado!`)
            cargarPaquetes()
        })
}

// Cargar la lista de paquetes al cargar la página
cargarPaquetes();