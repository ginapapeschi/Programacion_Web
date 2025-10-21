// VALIDACIÓN DE FORMULARIO
const formulario = document.querySelector('#formulario-contacto form');

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById('nombre').value.trim(); 
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  // expresionEmail es una expresión regular que comprueba si el email tiene un formato válido (algo@algo.algo).
  // con "/.../" se define una expresión regular en JavaScript. Es un patrón que permite "buscar" o "validar" texto.
  // ^ indica INICIO de la cadena y $ FIN de la cadena, por lo que aseguran que la expresión valide TODO el string.
  // [,] definen un conjunto de caracteres, ^ dentro del conjunto indica negación, "\s" espacio en blanco, "+" uno o más caracteres, "\." exige un punto literal.
  // [^\s@]+ -> Cualquier caracter que NO sea ni espacio en blanco ni @. El "+" indica uno o más de los caracteres SÍ aceptados.

  if (!nombre || !email || !mensaje) { 
    alert('Por favor completa todos los campos.');
    return;
  }

  if (nombre)
  if (!expresionEmail.test(email)) { 
    alert('Por favor ingresa un correo válido.');
    return;
  }

  // GUARDAR EN LOCAL STORAGE
  const mensajes = JSON.parse(localStorage.getItem('contacto')) || [];
  mensajes.push({ nombre, email, mensaje });
  localStorage.setItem('contacto', JSON.stringify(mensajes));
  // .setItem(clave, valor) guarda los datos bajo la clave "contacto". JSON.stringify convierte el objeto en una cadena para poder guardarlo, ya que localStorage solo puede almacenar strings. 

  alert('Mensaje enviado correctamente (simulado)');
  formulario.reset();
});

// BOTÓN VOLVER ARRIBA
const botonArriba = document.getElementById('botonArriba');

window.addEventListener('scroll', () => {
  if (window.scrollY > 1200) {
    botonArriba.classList.add('visible'); // Agrega la clase para darle visibilidad.
  
  } else {
    botonArriba.classList.remove('visible'); // Quita la clase para ocultar.
    
  }
});

botonArriba.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// EXPANDIR PROYECTO
const proyectos = document.querySelectorAll('#proyectos article'); // Busca TODOS los elementos que coincidan con el selector CSS <article> y devuelve un arreglo (NodeList) con los encontrados.

proyectos.forEach(proyecto => {
  const titulo = proyecto.querySelector('h3');
  const contenido = Array.from(proyecto.children).filter(elemento => elemento !== titulo); 
  // proyecto.children devuelve una colección HTMLCollection de todos los elementos hijos directos del <article>.
  // "Array.from(...)" convierte esa colección en un array normal para poder usar métodos como .filter.
  // .filter(elemento => elemento !== h3) crea un nuevo array excluyendo h3, entonces "contenido" contiene todos los hijos del <article> menos el h3. Es decir, todo el contenido luego del título. Permite separarlos sin afectar al título.

  const textoOriginal = titulo.textContent;
  // textContent es una propiedad de los nodos DOM que devuelve TODO EL TEXTO dentro del elemento, sin etiquetas HTML (no incluye estilos, sólo el texto).

  contenido.forEach(elemento => elemento.style.display = 'none'); // Oculta cada elemento luego del título.

  // Añade viñeta al título.
  titulo.textContent = '▶ ' + textoOriginal;
  titulo.style.cursor = 'pointer';
  titulo.addEventListener('click', () => {
    const abierto = contenido[0].style.display === 'block';
    // Verifica si el primer elemento del contenido está actualmente visible (display: block) para determinar si el contenido está abierto o cerrado. Será True o False.
    contenido.forEach(elemento => elemento.style.display = abierto ? 'none' : 'block');
    // Si es True pone el display en none (si estaba abierto lo oculta), sino lo muestra. Es como un if, operado con un operador ternario.

    titulo.textContent = (abierto ? '▶ ' : '▼ ') + textoOriginal;
    // La misma lógica de arriba, y le escribe el título.
  });
});

// FECHA EN FOOTER
const footerText = document.getElementById('footer-text');
const fecha = new Date();
const formato = {
  year: 'numeric',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
};

footerText.textContent = `${fecha.toLocaleDateString('es-ES', formato)}hs`;
// Las comillas invertidas (`,`) permiten usar templates literals (plantillas de texto modernas en JavaScript), donde se puede insertar dentro de ellas variables con ${...} en lugar de concatenar con "+".
footerText.style.fontSize = '17px';

// TEMA CLARO/OSCURO
const botonTema = document.getElementById('botonTema');

botonTema.addEventListener('click', () => {
  document.body.classList.toggle('tema-oscuro');
});

// CLIMA CON API DE OPENWEATHERMAP
const formClima = document.getElementById('formClima');

formClima.addEventListener('submit', async (e) => {
  e.preventDefault();
  const ciudad = document.getElementById('ciudad').value.trim();

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
    resultadoClima.innerHTML = `<p style="color: #c32f79;">${error.message}</p>`;
  }
});

