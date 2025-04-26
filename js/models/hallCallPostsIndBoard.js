import * as THREE from 'three';
import * as Element from "./elementNames.js";
import {setCallPostType, 
  setIndicationBoardType} from 
  "../shareConfiguration/hallParams.js";

let callPostObjects = {}; // Кэш для быстрого доступа
let indBoardObjects = {}; // Кэш для быстрого доступа

export function initCallPostsHandler(model) {
  // Предварительно находим и кэшируем все объекты
  Element.callPostsHall.forEach(postName => {
    model.traverse(child => {
      if (child.name === postName) {
        callPostObjects[postName] = child;
      }
    });
  });

  // Назначаем обработчики
  document.querySelectorAll('input[name="call_post_type"]').forEach((radio, index) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        const postNumber = index + 1;
        const selectedPost = `call_post_${postNumber}`;

        setCallPostType(radio.id);
        
        // Управление видимостью
        Object.entries(callPostObjects).forEach(([name, obj]) => {
          obj.visible = (name === selectedPost);
        });
      }
    });
  });
  
  // По умолчанию показываем первый вариант
  if (Element.callPostsHall.length > 0) {
    callPostObjects['call_post_1'].visible = true;

    for (let i = 1; i < Element.callPostsHall.length; i++) {
        callPostObjects[`call_post_${i + 1}`].visible = false;
    }
  }
}

export function initIndicationBoardHandler(model) {
    // Предварительно находим и кэшируем все объекты
    Element.indicationBoardHall.forEach(indName => {
      model.traverse(child => {
        if (child.name === indName) {
            indBoardObjects[indName] = child;
        }
      });
    });
    document.querySelectorAll('input[name="ind_board_type"]').forEach((radio, index) => {
        radio.addEventListener('change', () => {
          if (radio.checked) {
            const indBoardNumber = index + 1;
            const selectedBoard = `ind_board_${indBoardNumber}`;
            
            setIndicationBoardType(radio.id);

            // Управление видимостью
            Object.entries(indBoardObjects).forEach(([name, obj]) => {
              obj.visible = (name === selectedBoard);
            });
          }
        });
      });
      
      // По умолчанию показываем первый вариант
      if (Element.indicationBoardHall.length > 0) {
        indBoardObjects['ind_board_1'].visible = true;

        for (let i = 1; i < Element.indicationBoardHall.length; i++) {
            indBoardObjects[`ind_board_${i + 1}`].visible = false;
        }
      }
    }