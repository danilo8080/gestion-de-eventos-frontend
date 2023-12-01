
import Swal from "sweetalert2";
import { nextTick } from '@vue/runtime-core';
import {useAuthStore } from '@/stores/auth'

export function showalerta(msj, icono, focus){
    if(focus !== '' && focus !== 'undefined'){
       nextTick( () => focus.value.focus());
    }
    
    Swal.fire({
        title:msj,
        icon:icono,
        buttonsStyling:true
        // customClass:{confirmButton:'btn btn-primary', popup:'animated zoonIn'},
    });
}

export function confirmation(name, url, accion = ''){
    const alert = Swal.mixin({buttonsStyling:true});
    let title = '¿Estas seguro que quieres eliminar a '+name+' de tus contactos?';
    if(accion == 'eventos') {
        title = '¿Estas seguro que quieres eliminar el evento '+name+' ?';
    }
    alert.fire({
        title:title,
        icon:'question',
        showCancelButton:true,
        confirmButtonText:'<i class="fa-solid fa-check"></i> si, eliminar',
        cancelButtonText:'<i class="fa-solid fa-ban"></i> Cancelar'
        }).then((res)=>{
            if(res.isConfirmed){
                sendRequest('DELETE',{},url);
            }else{
                showalerta('operacion cancelada','info', '');
            }
        
        });
}

export async function sendRequest(method, params, url, alert = true, redirect=''){
    const authStore = useAuthStore();
    axios.defaults.headers.common['Authorization'] = 'Bearer '+authStore.authToken;
    let res;
    await axios({ method:method, url:url, data:params }).then(
        response => {
            res = response
        }).catch((errors) => {
            showalerta(errors.response.data.message, 'error', '')
        })
    if ( typeof res !== 'undefined' && res.status < 300 && alert) {
        showalerta(res.data.message, 'success', '')
    }
    return res;
}