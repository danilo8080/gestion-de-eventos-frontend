<script setup>
import { ref, onMounted } from 'vue';
import { confirmation, sendRequest } from '../../functions'

onMounted( ()=> { 
    getContactos();
    getUsuarios();
});
const contactos = ref([]);
const usuarios = ref([]);
const referencia = ref([]);
const load = ref(false);
const form = ref({nombre: '', descripcion: '', tipo: '', avatar: ''}); 

const getContactos = async () => {
    sendRequest('GET', {}, '/api/v1/listarcontactos', false).then(response => {
        contactos.value = response.data.data 
    })
    load.value = true;
}
const eliminarContactos = (email, nombre) => {
    confirmation(nombre, ('/api/v1/eliminarcontacto/'+email));
    setTimeout(function() {
        getContactos();
        getUsuarios();
    }, 2000);
}
const getUsuarios = async () => {
    sendRequest('GET', {}, ('/api/v1/usuarios/buscar/'+referencia.value), false).then(response => {
        usuarios.value = response.data.data 
    })
    load.value = true;
}

const agregarContacto = async (email) => {
    sendRequest('GET', {}, ('/api/v1/crearcontacto/'+email));
    setTimeout(function() {
        getUsuarios();
        getContactos();
    }, 1400);
}
const convertidor = (imagen) => {
    return `data:image/jpeg;base64,${imagen}`;
}

</script>
<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div class="d-grid col-10 mx-auto">
                <a class="btn btn-dark" type="button" data-bs-toggle="modal" data-bs-target="#modalContactos">
                <i class="fa-solid fa-circle-plus"></i> agregar contactos
                </a>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card border-white text-center" v-if="!load">
                <div class="card-body">
                    <img src="/contacts.gif" class="img-fluid" alt="cargando...">
                </div>
            </div>
            <div class="table-responsive" v-else>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Foto</th>
                            <th>Correo</th>
                            <th>Nombre</th>
                            <th>Apodo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="contacto, i in contactos" :key="contacto.id">
                            <td>{{ (i+1) }}</td>
                            <td class="td-image"> <img class="mini-image" :src="convertidor(contacto.foto)" alt="Image" /></td>
                            <td>{{ contacto.email }}</td>
                            <td>{{ contacto.nombre }}</td>
                            <td>{{ contacto.apodo }}</td>
                            <td>
                                <button class="btn btn-danger" @click="eliminarContactos(contacto.email,  contacto.nombre)">
                                    <i class="fa-solid fa-trash"></i> 
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
  
        <!-- Modal agregar contactos -->
        <div class="modal fade" id="modalContactos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Agregar Contactos</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="text" class="form-control" v-model="referencia" @input="getUsuarios">
                    <br>
                    <table class="table table-primary">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="usuario in usuarios" :key="usuario.id">
                            <td>{{ usuario.email }}</td>
                            <td>
                                <button class="btn btn-success" @click="agregarContacto(usuario.email)">
                                    <i class="fa-solid fa-circle-plus"></i>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">cerrar</button>
                    <!-- <button type="button" class="btn btn-primary">Understood</button> -->
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<style>
.td-image {
    width: 40px;
    height: 40px;
}
.mini-image {
    width: 100%;
    height: auto;
    border-radius: 50%;
}

</style>