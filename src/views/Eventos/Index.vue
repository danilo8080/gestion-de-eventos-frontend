<script setup>
import { ref, onMounted } from 'vue';
import { confirmation, sendRequest } from '../../functions'

onMounted( ()=> { 
    getContactos();
    getEventos();
});
const nombreEvento  = ref('');
const eventoId      = ref('');
const contactos  = ref([]);
const eventos    = ref([]);
const usuarios   = ref([]);
const referencia = ref([]);
const referenciaContacto = ref([]);
const load = ref(false);
const form = ref({nombre: '', descripcion: '', tipo: '', avatar: ''}); 

const getContactos = async () => {
    sendRequest('GET', {}, ('/api/v1/listarcontactos/'+referenciaContacto.value), false).then(response => {
        contactos.value = response.data.data 
    })
    if(!(contactos.value.length > 0)) {
        contactos.value = ["" ]
    }
    load.value = true;
}

const crearEvento = async (form) => {
    sendRequest('POST', form, ('/api/v1/crearevento'));
    setTimeout(function() {
        getEventos();
        limpiarCampos();
    }, 1000);
}

const agregarContacto = async (email) => {
    const data = {email: email}
    sendRequest('POST', data, ('/api/v1/agregarcontacto/'+eventoId.value));
    setTimeout(function() {
        getEventos();
    }, 1000);
}

const getEventos = async () => {
    sendRequest('GET', {}, ('/api/v1/listareventos/'+referencia.value), false).then(response => {
        eventos.value = response.data.data 
    })
    load.value = true;
}
const eliminarEvento = (id, nombre) => {
    confirmation(nombre, ('/api/v1/eliminarevento/'+id), 'eventos');
    setTimeout(function() {
        getEventos();
    }, 1000);
}
const limpiarCampos = () => {
    form.value.nombre = '';
    form.value.descripcion = '';
    form.value.tipo = '';
    nombreEvento.value = '';
    eventoId.value = '';
    referencia.value = '';
    referenciaContacto.value = '';
}
const agregarContactosAlEvento = (id, nombre) => {
    nombreEvento.value = nombre;
    eventoId.value     = id;
}

</script>
<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div class="d-grid col-10 mx-auto">
                <a class="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#agregarEventos">
                    <i class="fa-regular fa-calendar-plus"></i> Crear Evento
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
                <input autofocus type="text" v-model="referencia"
                      placeholder="Buscar Evento . . . " id="filtro" class="form-control" @input="getEventos">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>nombre</th>
                            <th>descripcion</th>
                            <th>tipo</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="evento, i in eventos" :key="evento.id">
                            <td>{{ (i+1) }}</td>
                            <td>{{ evento.nombre }}</td>
                            <td>{{ evento.descripcion }}</td>
                            <td>{{ evento.tipo }}</td>
                            <td>
                                <button class="btn btn-success options" data-bs-toggle="modal" data-bs-target="#modalContactos" @click="agregarContactosAlEvento(evento.id, evento.nombre)">
                                    <i class="fa-solid fa-user-plus"></i>
                                </button>
                                <button class="btn btn-warning options" data-bs-toggle="modal" data-bs-target="#modalContactos" @click="agregarActividadesAlEvento(evento.id)">
                                    <i class="fa-solid fa-file-circle-plus" style="color: #fffffa;"></i>
                                </button>
                                <button class="btn btn-danger options" @click="eliminarEvento(evento.id,  evento.nombre)">
                                    <i class="fa-solid fa-trash"></i> 
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal agregar eventos -->
    <div class="modal fade" id="agregarEventos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Crear Evento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="crearEvento(form)">
                    <div class="input-group mb-3">
                      <span class="input-group-text">
                        <i class="fa-solid fa-equals"></i>
                      </span>
                      <input autofocus type="text" v-model="form.nombre"
                      placeholder="Nombre" id="nombre" class="form-control">
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text">
                        <i class="fa-solid fa-calendar-week"></i>
                      </span>
                      <input autofocus type="text" v-model="form.descripcion"
                      placeholder="Descripcion" id="descripcion" class="form-control">
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text">
                        <i class="fa-regular fa-calendar-days"></i>
                      </span>
                      <input autofocus type="text" v-model="form.tipo"
                      placeholder="Viaje, Hogar, Pareja, Comida, Etc..." id="email" class="form-control">
                    </div>
                    <!-- <div class="input-group mb-3">
                      <span class="input-group-text">
                        <i class="fa-solid fa-key"></i>
                      </span>
                      <input type="text" v-model="form.avatar"
                      placeholder="Avatar" id="avatar" class="form-control">
                    </div> -->
                    <div class="d-grid col-10 mx-auto">
                      <button class="btn btn-success" data-bs-dismiss="modal">Enviar</button>
                    </div>
                  </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">cerrar</button>
                <!-- <button type="button" class="btn btn-primary">Understood</button> -->
            </div>
        </div>
        </div>
    </div>

    <!-- Modal agregar contactos -->
    <div class="modal fade" id="modalContactos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Agregar Contactos Al Evento {{ nombreEvento }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control" v-model="referenciaContacto" @input="getContactos">
                <br>
                <table class="table table-primary">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-if="contactos.length > 0">
                        <tr v-for="usuario in contactos" :key="usuario.id">
                            <td>{{ usuario.email }}</td>
                            <td>
                                <button class="btn btn-success" @click="agregarContacto(usuario.email)">
                                    <i class="fa-solid fa-circle-plus"></i>
                                </button>
                            </td>
                        </tr>
                    </template>
                    <tr colspan="2" v-else> No tienes contactos agregados <i class="fa-regular fa-face-sad-tear" style="color: #000000;"></i></tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">cerrar</button>
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

#filtro {
    width: 35%;
    margin-bottom: 1%;
}

.options {
    margin: 1%;
}

</style>