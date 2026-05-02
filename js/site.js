const dataUrl = 'data/people/people.json';

const fetchPeople = async () => {
  const response = await fetch(dataUrl);
  return response.json();
};

const personLink = (id, index) => {
  const person = index.get(id);
  return person ? `<a href="person.html?id=${person.id}">${person.name}</a>` : `<span>${id}</span>`;
};

const renderIndex = async () => {
  const list = document.querySelector('#people-list');
  if (!list) return;

  const people = await fetchPeople();
  people
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((person) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="person.html?id=${person.id}">${person.name}</a>`;
      list.appendChild(li);
    });
};

const renderPerson = async () => {
  const root = document.querySelector('#person-root');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const people = await fetchPeople();
  const index = new Map(people.map((p) => [p.id, p]));
  const person = index.get(id);

  if (!person) {
    root.innerHTML = '<section class="card"><h2>Person not found</h2><p><a href="index.html">Back to register</a></p></section>';

    return;
  }

  const list = (label, ids) => `<div class="panel"><h3>${label}</h3><ul>${ids.map((x) => `<li>${personLink(x, index)}</li>`).join('') || '<li>Unknown</li>'}</ul></div>`;

  root.innerHTML = `
    <section class="card">
    <p><a href="index.html">← Return to family register</a></p>
    <h2>${person.name}</h2>
    <p class="meta">${person.birth_date || 'Unknown birth'} – ${person.death_date || 'Unknown death'}</p>
    <p>${person.bio || 'No biography yet.'}</p>
    <p><strong>Occupation:</strong> ${person.occupation || 'Unknown'}</p>
    <p><strong>Notes:</strong> ${person.notes || 'None'}</p>
    <section class="grid">
      ${list('Parents', person.parents || [])}
      ${list('Spouse(s)', person.spouse || [])}
      ${list('Children', person.children || [])}
    </section>
    </section>
  `;
};

renderIndex();
renderPerson();
