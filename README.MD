# API REST

Este proyecto implementa una API REST que permite realizar operaciones CRUD (crear, leer, actualizar y eliminar) sobre entidades como categoría y producto.
Está desarrollado en Node.js utilizando Express como framework, Sequelize como ORM y MySQL2 como base de datos.

## Intrucciones
## Guia para realizar esta app:
# Inicializar un repositorio local de Git
``` shell
 git init 
```
# Instalar las dependencias principales

``` shell
 npm install
```
# Instalar nodemon (para reinicios automáticos en desarrollo)
``` shell
 npm install nodemon
```

``` shell
 node i
```

``` shell
node index.js  
```
# Instalar Sequelize y MySQL2

``` shell
npm install sequelize 
```

``` shell
npm install mysql2
```
## Clonar Repositorio

``` shell
git clone https://github.com/LeiverRuben/Appi-rest-node.js.git 
cd api-rest-node.js
```

## Que hace el app:
- get
- post
- Put
- delete
- De las diferentes entidades que se crean mediante los models

## Configurar la api
- Debemos crear el **.env** y el **.env.example**,seguido de un **README.MD.**
- Dentro del .env registraremos el puerto que usaremos, siendo el **port=3000**, ademas de añadirlo tambien en el .env.example.
- En el mismo .env configuraremos los diferentes datos para la conexion con nuestra base de datos.
- No debemos olvidar el **.gitignore** que nos permitira excluir archivos no necesarios, que no se subiran al repositorio de GitHub.
- Una vez sepamos que nuestra configuracion basica esta construida, podremos pasar a la creación de las entidades, y darle forma a nuestra api.
- Tengamos en cuenta que debemos tener instalado el **sequelize** y **mysql2**, para que todo funcione, pero este paso es importante luego de que creemos nuestra carpeta **SRC**, aqui ira toda nuestra configuración de la base de datos ubicada en **database.js**, ademas, los modelos,controladores, rutas, y el **app.js**.

## Ejecutar el servidor
``` shell
npm run dev
```

``` shell
npm start
```