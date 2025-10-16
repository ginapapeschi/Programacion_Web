// -------------------- Validación de formulario --------------------
const formulario = document.querySelector('#formulario-contacto form'); // document.querySelector busca en el HTML el primer elemento que coincida con el selector CSS. Selecciona el formulario dentro del contenedor con id "formulario-contacto" y lo guarda en la variable form.
// document representa todo el HTML
// #formulario-contacto form es un selector CSS: "#formulario-contacto" es el id del contenedor, "form" es el elemento <form> dentro de ese contenedor.

formulario.addEventListener('submit', (evento) => { // "formulario" es la variable que apunta al <form> en la página.
  // .addEventListener('submit', ...) dice que cuando pase el EVENTO submit del formulario, ejecute el código.
  // (evento) => es una función flecha que se ejecuta cuando ocurre el evento. "evento" es el objeto del evento, y contiene información sobre lo que pasó. Funciona como parámetro de la función.
  evento.preventDefault(); // Evita que el formulario recargue la página.

  const nombre = document.getElementById('nombre').value.trim(); // Busca el elemento del HTML que tenga el atributo id="nombre". El .value obtiene el valor que el usuario escribió dentro del input, y el .trim() elimina los espacios en blanco al principio y al final de la cadena.
  // const significa que no se va a reasignar esta variable, pero puede seguirse leyendo su valor.

  const email = document.getElementById('email').value.trim(); // Ingresado por el usuario
  const mensaje = document.getElementById('mensaje').value.trim();
  const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // expresionEmail es una expresión regular que comprueba si el email tiene un formato válido (algo@algo.algo).
  // con "/.../" se define una expresión regular en JavaScript. Es un patrón que permite "buscar" o "validar" texto.
  // ^ indica INICIO de la cadena y $ FIN de la cadena, por lo que aseguran que la expresión valide TODO el string.
  // [,] definen un conjunto de caracteres, ^ dentro del conjunto indica negación, "\s" espacio en blanco, "+" uno o más caracteres, "\." exige un punto literal.
  // [^\s@]+ -> Cualquier caracter que NO sea ni espacio en blanco ni @. El "+" indica uno o más de los caracteres SÍ aceptados.

  if (!nombre || !email || !mensaje) { // Si no hay nombre, email o mensaje.
    alert('Por favor completa todos los campos.'); // Muestra una ventana emergente en el navegador
    return;
  }
  if (!expresionEmail.test(email)) { // Verifica que el email cumpla el formato. test() es un método de las expresiones regulares, que sirve para verificar si un texto cumple con un patrón.
    alert('Por favor ingresa un correo válido.');
    return; // Detiene la ejecución si falla alguna validación.
  }

  // Guardar en localStorage.
  const mensajes = JSON.parse(localStorage.getItem('contacto')) || [];
  mensajes.push({ nombre, email, mensaje });
  localStorage.setItem('contacto', JSON.stringify(mensajes));
  // localStorage es un almacenamiento en el navegador que persiste aunque se cierre la página. .setItem(clave, valor) guarda los datos bajo la clave "contacto". JSON.stringify convierte el objeto en una cadena para poder guardarlo, ya que localStorage solo puede almacenar strings. 

  alert('Mensaje enviado correctamente (simulado)');
  formulario.reset(); // Deja los campos vacíos del formulario para otro envío.
});

// -------------------- Botón Volver Arriba --------------------
const botonArriba = document.getElementById('botonArriba');

window.addEventListener('scroll', () => { // Cuando se haga 'scroll' se ejecuta la función (no recibe parámetros).
  if (window.scrollY > 1200) { // Indica cuántos pixeles se ha desplazado verticalmente la página desde el inicio.
    botonArriba.classList.add('visible'); // Agrega la clase para darle visibilidad.
  
  } else {
    botonArriba.classList.remove('visible'); // Quita la clase para ocultar.
    
  }
});

botonArriba.addEventListener('click', () => { // Cuando se detecta un click en el botón.
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrollea hasta el pixel 0 de forma suave.
});

// -------------------- Expandir proyectos --------------------
const proyectos = document.querySelectorAll('#proyectos article'); // Busca TODOS los elementos que coincidan con el selector CSS <article> y devuelve un arreglo (NodeList) con los encontrados.

proyectos.forEach(proyecto => { // Recorre cada artículo individualmente, llamando a la función para cada uno.
  const titulo = proyecto.querySelector('h3'); // Busca dentro del <article> actual el PRIMER <h3>.
  const contenido = Array.from(proyecto.children).filter(elemento => elemento !== titulo); 
  // proyecto.children devuelve una colección HTMLCollection de todos los elementos hijos directos del <article>.
  // "Array.from(...)" convierte esa colección en un array normal para poder usar métodos como .filter.
  // .filter(elemento => elemento !== h3) crea un nuevo array excluyendo h3, entonces "contenido" contiene todos los hijos del <article> menos el h3. Es decir, todo el contenido luego del título. Permite separarlos sin afectar al título.

  const textoOriginal = titulo.textContent; // Guardar texto original una sola vez.
  // textContent es una propiedad de los nodos DOM que devuelve TODO EL TEXTO dentro del elemento, sin etiquetas HTML (no incluye estilos, sólo el texto).

  contenido.forEach(elemento => elemento.style.display = 'none'); // Oculta cada elemento luego del título.

  // Viñeta inicial solo para los 3 títulos de proyectos.
  titulo.textContent = '▶ ' + textoOriginal;
  titulo.style.cursor = 'pointer';
  titulo.addEventListener('click', () => {
    const abierto = contenido[0].style.display === 'block'; // Verifica si el primer elemento del contenido está actualmente visible (display: block) para determinar si el contenido está abierto o cerrado. Será True o False.
    contenido.forEach(elemento => elemento.style.display = abierto ? 'none' : 'block'); // Si es True pone el display en none (si estaba abierto lo oculta), sino lo muestra. Es como un if, operado con un operador ternario.

    titulo.textContent = (abierto ? '▶ ' : '▼ ') + textoOriginal; // La misma lógica de arriba, y le escribe el título.
  });
});

// -------------------- Fecha actual en footer --------------------
const footerText = document.getElementById('footer-text'); // Busca en HTML el elemento que tenga ese ID.
const fecha = new Date(); // Crea un nuevo objeto de tipo Date con la fecha y hora actuales del sistema. Date() es un constructor de JavaScript.
const dia = fecha.getDate();          // Día del mes.
const mes = fecha.getMonth() + 1;     // Mes del 1 al 12. El "+1" es porque devuelve del 0 al 11.
const anio = fecha.getFullYear();     // Año completo.

footerText.textContent = `© ${anio} Gina Papeschi — Portfolio personal (${dia}/${mes}/${anio})`; // Cambia el texto del elemento con id="footer-text", reemplazando su contenido sin etiquetas HTML.
// Las comillas invertidas (`,`) permiten usar templates literals (plantillas de texto modernas en JavaScript), donde se puede insertar dentro de ellas variables con ${...} en lugar de concatenar con "+".
footerText.style.fontSize = '17px';

// -------------------- Tema claro/oscuro --------------------
const botonTema = document.getElementById('botonTema');

botonTema.addEventListener('click', () => {
  document.body.classList.toggle('tema-oscuro');
});



// -------------------- Clima con API de OpenWeatherMap --------------------
const formClima = document.getElementById('formClima');

formClima.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que recargue la página
  const ciudad = document.getElementById('ciudad').value.trim();
  // Tu código de fetch aquí

  if (!ciudad) {
    alert('Por favor ingresa una ciudad.');
    return;
  }

  const apiKey = 'c5b31e8548dc194275878cee687758bd'; // Clave personal de OpenWeather

  try {
    // Buscar coordenadas de la ciudad (usando la API de geocodificación)
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(ciudad)},AR&limit=1&appid=${apiKey}`;
    const geoResp = await fetch(geoUrl);
    if (!geoResp.ok) throw new Error('No se pudo obtener la ubicación.');

    const geoData = await geoResp.json();
    if (geoData.length === 0) throw new Error(`No se encontró la ciudad "${ciudad}".`);

    const { lat, lon, name, country } = geoData[0];

    // Con las coordenadas obtenidas, pedimos el clima.
    const climaUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
    const climaResp = await fetch(climaUrl);
    if (!climaResp.ok) throw new Error('No se pudo obtener el clima.');

    const datos = await climaResp.json();

    // Procesar y mostrar los resultados.
    const temp = Math.round(datos.main.temp);
    const descripcion = datos.weather[0].description;
    const icono = `https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png`;

    resultadoClima.innerHTML = `
      <p><strong>${name}, ${country}</strong></p>
      <p>🌡️ Temperatura: <strong>${temp}°C</strong></p>
      <p>☁️ Clima: <strong>${descripcion}</strong></p>
      <img src="${icono}" alt="${descripcion}">
    `;
  } catch (error) {
    resultadoClima.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
});