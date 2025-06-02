import './style.css';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

const supabaseUrl = 'https://gdfpwixfrujkoxlejcgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZnB3aXhmcnVqa294bGVqY2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTY0NjMsImV4cCI6MjA2MzMzMjQ2M30.btatLN5ciqWbERzsaDvk6yyTI2eJJY1wjTUDFsmA00Q';
const supabase = createClient(supabaseUrl, supabaseKey);

const articleDiv = document.getElementById('article');
const form = document.getElementById('articleForm');
const sortSelect = document.getElementById('sortSelect');

async function loadArticle() {
  const [field, direction] = sortSelect.value.split('.');

  const { data, error } = await supabase
    .from('article')
    .select('*')
    .order(field, { ascending: direction === 'asc' });

  if (error) {
    articleDiv.innerHTML = `<p>Błąd: ${error.message}</p>`;
    return;
  }

  if (!data.length) {
    articleDiv.innerHTML = `<p>Brak artykułów do wyświetlenia.</p>`;
    return;
  }

  articleDiv.innerHTML = data.map(a => `
    <div class="article">
      <h3>${a.title}</h3>
      <p><em>${a.subtitle}</em></p>
      <p><strong>${a.author}</strong> | ${format(new Date(a.created_at), 'dd-MM-yyyy')}</p>
      <p>${a.content}</p>
    </div>
  `).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const article = {
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    author: formData.get('author'),
    content: formData.get('content'),
    created_at: new Date(formData.get('created_at')).toISOString()

  };

  const { data, error } = await supabase.from('article').insert([article]);

  if (error) {
    alert('Błąd przy dodawaniu: ' + error.message);
  } else {
    alert('Dodano artykuł!');
    form.reset();
    loadArticle();
  }
});

loadArticle();
sortSelect.addEventListener('change', () => loadArticle());
