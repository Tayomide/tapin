window.electronAPI.onCardInserted((uid) => {
  console.log('Card inserted:', uid);
  document.getElementById('uid').textContent = uid;
});

window.electronAPI.onCardRemoved(() => {
  console.log('Card removed');
  document.getElementById('uid').textContent = '';
})