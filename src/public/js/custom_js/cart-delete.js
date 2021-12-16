const deleteCart = function (ID) {
    document.getElementById("book_" + ID).style = "position: absolute;top: -9999px;left: -9999px;visibility: hidden;"
    document.getElementById("quantity_" + ID).value = 0
    return false
}