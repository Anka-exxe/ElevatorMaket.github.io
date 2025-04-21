/*import {setAllParameters, 
    getAllParameters} from 
    "../../shareConfiguration/allParams.js";

    import {projectsCache, templatesCache,
        fetchDesignProjects,fetchTemplates} 
        from "../../designProjectService/designProjectStorage.js";
   
   import { showTab } from "../../animation/tabFunctions.js";
   
    
   let activeProjectId = null;
   let isDesignProjectsLoaded = false;
   
   function selectDesignProjectButton(button) {
       selectParameterButton(button);
       activeProjectId = button.id; 
   }
   
   async function populateForm() {
       const projects = await fetchDesignProjects();
       const form = document.forms['designForm']; // Получаем форму по имени
   
       if (projects && projects.length > 0) {
           projects.forEach(project => {
               const button = document.createElement('button');
               button.id = project.id; // Используем ID проекта
               button.className = 'form__form-element'; // Класс кнопки
               button.type = 'button'; // Тип кнопки
               button.innerText = project.name; // Название проекта
               button.onclick = () => selectDesignProjectButton(button); // Обработчик клика
   
               // Добавляем кнопку в форму
               form.appendChild(button);
           });
       } else {
           console.log('No design projects available.');
       }
   }
   
   function selectParameterButton(button) {
       const container = button.parentNode; 
       const buttons = container.querySelectorAll('button'); 
       buttons.forEach(btn => {
           btn.classList.remove('active'); 
       });
       button.classList.add('active'); 
   }
   
  await populateForm();*/




