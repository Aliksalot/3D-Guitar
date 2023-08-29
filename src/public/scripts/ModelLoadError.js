const ModelLoadError = () => {
    console.log('error')
    const w = document.getElementById('guitar-window')
    w.innerHTML = ''
    w.style.backgroundImage = 'url("../images/misc/model_missing.png")'
    w.style.backgroundRepeat = 'no-repeat'
    w.style.backgroundSize = 'cover'
    
}