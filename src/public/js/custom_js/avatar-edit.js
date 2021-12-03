formFileSm.onchange = evt => {
    const [file] = formFileSm.files
    if (file) {
        avatar.src = URL.createObjectURL(file)
    }
}