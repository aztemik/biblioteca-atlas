export const ui = {
    showLoader(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="d-flex justify-content-center my-5 w-100">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>`;
        }
    },

    hideLoader(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    },

    showAlert(message, type = 'danger') {
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        if (!alertPlaceholder) {
            const div = document.createElement('div');
            div.id = 'liveAlertPlaceholder';
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.right = '20px';
            div.style.zIndex = '1050';
            document.body.append(div);
        }
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
               <div>${message}</div>
               <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        
        document.getElementById('liveAlertPlaceholder').append(wrapper);
        
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(wrapper.querySelector('.alert'));
            alert.close();
        }, 5000);
    }
};
