# Intrucciones
## Guia para realizar esta app:

Lo primero sera instalar las dependecias y preparar el entorno

``` shell
Esto te permitira crear un repositorio local de git

 git init  
```

``` shell
 npm install
```

``` shell
 npm install nodemon
```

``` shell
 node i
```

``` shell
node index.js  
```

``` shell
npm install sequelize 
```

``` shell
npm install mysql2
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


