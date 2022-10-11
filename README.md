<h1 align="center">DarkRoom</h1>

En el mundo de la fotografía, no es facil conseguir trabajo, ni mucho menos conseguir que valoren tu trabajo.
Por eso nace Darkroom, la web que busca el crecimiento de emprendedores, fotógrafos, personas con proyectos personales o empresas que buscan imágenes inéditas y únicas.
De forma legal, única y rápida. Podes comprar, vender, y descargar.

<img src="https://github.com/No-Country/C7-G29/blob/dev/images/banner.png">

Deploy: [Expo](https://expo.dev/@juanfranco/Dark-Room) (No es la version de develop)(Se require descargar Expo desde iOS/Android store y escanear el qr con la aplicacion)

## Importante

Esta es la version mobile app del proyecto C7-29 para funcionar correctamente se requiere del back funcionado que se puede encontrar en:


  - C7-29 Back End: [Proyecto C7-29 Back-End](https://github.com/No-Country/C7-G29/tree/dev/api) 



## Tecnologias
  - Front End: [React-Native](https://reactnative.dev/), [Redux-Toolkit](https://redux-toolkit.js.org), [Expo-Go](https://expo.dev/client)
  - Back End: [Node.js](https://nodejs.org), [Mongodb](https://www.mongodb.com/), [Express.js](https://expressjs.com/) 
  
## Features

-La Aplicacion funciona para iOS y Android:

-Tiene un navegador con 4 opciones en el pie de la app

**-Inicio**
- Muestra una lista de Fotos, con la opcion de descargar si la foto es gratis o añadir al carro si es paga.
- Hay un boton que despliega un menu con opciones de ordenamiento, filtro y barra de busqueda.
- Al añadir al carro salta una pequeña notificacion por debajo avisandonos que se añado correctamente y con un boton para deshazer esta accion.
- El botton de carro se actualiza sumandole/restandole un 1 a la cantidad de items.
- Al scrollear hacia abajo/arriba estando abajo/arriba del todo se refrescan los items y mientras esta cargando muestra un gif de loading.
- Se puede entrar al carro a sacar los items o borrar todos los items
- Al presionar el boton de borrar todo salta un modal advirtiendonos de lo que vamos a hacer y preguntandonos si deseamos continuar
		
**-Perfil**
- Deja loguearte (con auth0) y guarda tu sesion, solamente te saluda con el  nombre de la cuenta que te logueaste

**-Subir Foto**
- Te pregunta titulo, descripcion, y si es paga entonces te deja un input para poner el precio y al intentar rellenar el precio con algo que no sean numeros te aparece una advertencia en rojo
- Te pide permisos para subir fotos desde archivos o tomar fotos con la camara si le das a sus correspondientes botones
- Muestra un gif de cargando mientras se sube la foto y al subirse te muestra la foto que hayas subido.

**-Mas Opciones**
- Te deja navegar entre las anteriores 3 opciones, ademas tenes un carrito y un switch para cambiar idioma entre español e ingles.

## Como usar

Para clonar y ejecutar esta aplicación, necesitará Git y Node.js instalados en su computadora.

<br>
Para obtener el codigo:

```bash
# Clone este repositorio
$ git clone https://github.com/No-Country/C7-G29.git
```
<br>
En su Visual Studio Code instale las dependencias del proyecto

```bash
# En la carpeta principal
$ npm install

# Luego instalar el cliente de expo go
$ npm install -g expo-cli

# Terminada la instalacion, ejecutar
$ npm start
```
<br>

## Equipo

Diseño ux/ui (web)
- [Christian Sotelo]()
- [Melvin Taveras]() 

Front End-React-Native con ExpoGo (mobile)
- [Franco Rodriguez](https://www.linkedin.com/in/juan-franco-rodriguez/)

Front-End Web
- [Franco Rodriguez](https://www.linkedin.com/in/juan-franco-rodriguez/)
- [rodrigo zucchini]()


Back-End (web-mobile)
- [Emanuel Juri](https://www.linkedin.com/in/emanuel-juri/) 
- [Joe Vega]()
- [Angel Villalba](https://www.linkedin.com/in/angelvillalba/)





