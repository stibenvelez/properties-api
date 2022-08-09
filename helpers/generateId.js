const generateId = () => {
    const radom = Math.random().toString(36).substring(2, 36) + Math.random().toString(36).substring(2, 36);
    const fecha = Date.now().toString(32);
    return radom + fecha;
}

export default generateId; 