async function getTodos() {
  for (const [idx, url] of urls.entries()) {
    const todo = await fetch(url);
    console.log(`Received Todo ${idx+1}:`, todo);
  }

  console.log('Finished!');
}

getTodos();








const results = tags.map((tag, index) => ({
  id: index + 1,
  title: tag.tags.title || undefined,
  artist: tag.tags.artist || undefined,
  album: tag.tags.album || undefined,
  year: tag.tags.year || undefined
}))
this.tracks = results
this.dispatchEvent(new CustomEvent('tracks-selected', {
  detail: this.tracks
}))
this._enableSearchButton()