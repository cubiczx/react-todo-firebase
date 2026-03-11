# React TODO Firebase ✅

Aplicación de gestión de tareas (TODO list) con persistencia en tiempo real utilizando Firebase Firestore, interfaz moderna con React Bootstrap y ordenamiento inteligente de tareas.

## 📋 Descripción

Esta aplicación es un gestor de tareas completo con almacenamiento en la nube:

- **Gestión de tareas**: Crear, completar, descompletar y eliminar tareas con actualización en tiempo real
- **Persistencia con Firebase**: Almacenamiento en Firestore con sincronización automática
- **Ordenamiento inteligente**: Tareas pendientes primero, luego completadas (las más recientes primero)
- **Confirmación de eliminación**: Modal de confirmación antes de eliminar tareas
- **Estados de UI**: Loading spinner y mensaje cuando no hay tareas
- **Interfaz moderna**: Diseño limpio y responsive con React Bootstrap
- **Iconos SVG personalizados**: Interfaz visual intuitiva con iconos inline

## 🛠️ Tecnologías

- React 19 (con nuevo JSX Transform)
- TypeScript
- Firebase SDK 12 (API modular)
- Cloud Firestore
- React Bootstrap v2
- Bootstrap 5
- SCSS/Sass
- React Testing Library
- Jest

## 🚀 Cómo Ejecutar

### Prerequisitos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Firebase (gratuita)

### Instalación

1. Navega al directorio del proyecto:

```bash
cd "react-todo-firebase"
```

2. Instala las dependencias:

```bash
npm install
```

3. **Configura Firebase** (ver sección de Configuración abajo)

### Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

### Ejecutar Tests

```bash
npm test
```

### Build para Producción

```bash
npm run build
```

## 📚 Conceptos Demostrados

### 1. **Firebase Modular API (v9+)**

Uso de la nueva sintaxis modular de Firebase para reducir el bundle size:

```ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 2. **Operaciones CRUD con Firestore**

Implementación completa de operaciones sobre la base de datos:

```ts
// Create
await addDoc(collection(db, "tasks"), {
  name: task,
  done: false,
  created: serverTimestamp(),
});

// Read
const q = query(
  collection(db, "tasks"),
  orderBy("done", "asc"),
  orderBy("created", "desc")
);
const querySnapshot = await getDocs(q);

// Update
const taskRef = doc(db, "tasks", task.id);
await updateDoc(taskRef, { done: !task.done });

// Delete
await deleteDoc(taskRef);
```

### 3. **Índices Compuestos en Firestore**

Configuración de índices para consultas complejas con múltiples orderBy:

```ts
// Requiere índice compuesto: done (ASC) + created (DESC)
query(collection(db, "tasks"), orderBy("done", "asc"), orderBy("created", "desc"));
```

### 4. **Gestión de Estados de Carga**

Manejo de estados asíncronos para mejor UX:

```tsx
const [loading, setLoading] = useState(true);
const [tasks, setTasks] = useState<Task[]>([]);

// Mostrar loading, mensaje de sin tareas, o lista
{
  loading ? (
    <Spinner />
  ) : tasks.length === 0 ? (
    <h3>No task found</h3>
  ) : (
    tasks.map((task) => <TaskComponent />)
  );
}
```

### 5. **Modal de Confirmación**

Prevención de eliminaciones accidentales:

```tsx
const [showModal, setShowModal] = useState(false);

<Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to delete the task "{task.name}"?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Cancel
    </Button>
    <Button variant="danger" onClick={deleteTask}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>;
```

### 6. **Importación de SVG como Componentes**

Uso de `ReactComponent` para SVGs inline optimizados:

```tsx
import { ReactComponent as SendIcon } from "../../assets/svg/send.svg";
import { ReactComponent as Check } from "../../assets/svg/check.svg";
import { ReactComponent as Delete } from "../../assets/svg/delete.svg";

<SendIcon />
```

### 7. **Nuevas Sintaxis de React 19**

Aprovechamiento de las mejoras de React 19:

```tsx
// No se necesita importar React para JSX
// import React from "react"; ❌

// FormEvent directo sin namespace React
import { useState, FormEvent } from "react";
const onSubmit = (event: FormEvent<HTMLFormElement>) => {};
```

### 8. **Reload Pattern para Actualización de Datos**

Patrón simple para refrescar datos tras mutaciones:

```tsx
const [reloadTask, setReloadTask] = useState(false);

useEffect(() => {
  setReloadTask(false);
  fetchTasks();
}, [reloadTask]);

// En componente hijo
setReloadTask(true); // Trigger re-fetch
```

## 📁 Estructura del Proyecto

```text
react-todo-firebase/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/
│   │   └── svg/
│   │       ├── check.svg
│   │       ├── delete.svg
│   │       └── send.svg
│   ├── components/
│   │   ├── AddTask/
│   │   │   ├── AddTask.tsx
│   │   │   ├── AddTask.scss
│   │   │   └── index.ts
│   │   └── Task/
│   │       ├── Task.tsx
│   │       ├── Task.scss
│   │       └── index.ts
│   ├── utils/
│   │   ├── firebase.ts
│   │   └── firebase.example.ts
│   ├── App.tsx
│   ├── App.scss
│   ├── index.tsx
│   └── index.scss
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Características Principales

### Gestión de Tareas

- ✅ Crear nuevas tareas con formulario simple
- ✅ Marcar tareas como completadas/pendientes con un clic
- ✅ Eliminar tareas con confirmación de seguridad
- ✅ Validación: no permite tareas vacías
- ✅ Input se limpia automáticamente tras añadir tarea

### Ordenamiento y Filtrado

- ✅ Tareas pendientes siempre al inicio
- ✅ Tareas completadas al final
- ✅ Dentro de cada grupo, las más recientes primero
- ✅ Ordenamiento gestionado por Firestore (no en cliente)

### Persistencia y Sincronización

- ✅ Almacenamiento en Firestore (no localStorage)
- ✅ Datos accesibles desde cualquier dispositivo
- ✅ Timestamps del servidor para consistencia
- ✅ Actualización automática tras cada operación

### Estados de UI

- ✅ Loading spinner durante carga inicial
- ✅ Mensaje "No task found" cuando no hay tareas
- ✅ Icono de check cambia de color al hover
- ✅ Modal de confirmación para eliminar
- ✅ Feedback visual en iconos (hover effects)

## 🔧 Configuración de Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Sigue los pasos del asistente (Analytics es opcional)

### 2. Crear Base de Datos Firestore

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona modo:
   - **Producción**: Con reglas de seguridad (recomendado)
   - **Prueba**: Acceso abierto (solo para desarrollo)
4. Selecciona la ubicación (elige la más cercana a tus usuarios)

### 3. Obtener Credenciales

1. Ve a **Configuración del proyecto** (icono de engranaje)
2. En la pestaña "General", baja hasta "Tus apps"
3. Haz clic en el icono **</>** (Web)
4. Registra la app con un nombre
5. Copia el objeto `firebaseConfig`

### 4. Configurar el Proyecto

1. **Copia el archivo de ejemplo**:

```bash
cp src/utils/firebase.example.ts src/utils/firebase.ts
```

2. **Reemplaza las credenciales** en `src/utils/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "tu-app-id",
};
```

> **Nota**: El archivo `firebase.ts` está en `.gitignore` para no exponer tus credenciales.

### 5. Configurar Reglas de Seguridad (Recomendado)

En Firestore Database > Reglas, configura reglas básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // Permitir lectura y escritura (ajusta según tus necesidades)
      allow read, write: if true;
    }
  }
}
```

> **Importante**: Para producción, implementa reglas más restrictivas con autenticación.

### 6. Crear Índice Compuesto

La aplicación usa ordenamiento por dos campos. Firebase te pedirá crear un índice:

1. Ejecuta la app y añade una tarea
2. Abre la consola del navegador
3. Si hay un error, verás un **link directo** para crear el índice
4. Haz clic en el link o créalo manualmente:
   - **Colección**: `tasks`
   - **Campo 1**: `done` - Ascendente
   - **Campo 2**: `created` - Descendente
   - **Permisos**: Colección
5. Haz clic en "Crear índice" y espera a que se compile (1-5 minutos)

## 🧪 Testing

El proyecto incluye configuración para testing con Jest y React Testing Library:

```bash
npm test
```

Tests incluidos:

- Tests de componentes básicos
- Configuración de setupTests.ts

## 🔐 Seguridad

### .gitignore

El archivo `firebase.ts` con tus credenciales está protegido:

```gitignore
# Firebase config
src/utils/firebase.ts
```

### Template de Configuración

Se incluye `firebase.example.ts` como referencia para otros desarrolladores.

### Reglas de Firestore

Para producción, implementa reglas más estrictas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // Solo usuarios autenticados
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "firebase": "^12.10.0",
  "react-bootstrap": "^2.x",
  "bootstrap": "^5.x",
  "sass": "^1.97.3",
  "typescript": "^4.x"
}
```

## 🎨 Personalización

### Estilos

Los archivos SCSS están organizados por componente. Modifica los colores en:

- `src/App.scss` - Estilos globales y título
- `src/components/AddTask/AddTask.scss` - Input de nueva tarea
- `src/components/Task/Task.scss` - Tarjetas de tareas

### Iconos

Reemplaza los SVG en `src/assets/svg/` para cambiar los iconos.

## 🤝 Contribuciones

Este es un proyecto educativo. Siéntete libre de hacer fork y experimentar con:

- Autenticación de usuarios (Firebase Auth)
- Categorías o etiquetas para tareas
- Fechas de vencimiento
- Prioridades
- Temas claro/oscuro

## 📝 Licencia

MIT

## 👨‍💻 Autor

**Xavier Palacín Ayuso**  
Email: cubiczx@hotmail.com  
GitHub: [@cubiczx](https://github.com/cubiczx)

Proyecto creado como parte del curso de React en Udemy.

---

## 📚 Recursos Adicionales

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)

## 🐛 Solución de Problemas

### Error: "The query requires an index"

**Solución**: Haz clic en el link del error en la consola para crear el índice automáticamente.

### Las tareas no se cargan

**Solución**: Verifica que:

1. Firebase está correctamente configurado en `firebase.ts`
2. Las reglas de Firestore permiten lectura
3. El índice compuesto está creado y habilitado

### Error: "Firebase config not found"

**Solución**: Asegúrate de haber creado `src/utils/firebase.ts` basándote en `firebase.example.ts` y con tus credenciales reales.
