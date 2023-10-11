//https://github.com/AlejandroGarcia1234/WindowsCalculator.git
const operators = ["+", "-", "/", "*"];
let firstNum = true;
let numbers = [];
let operator_value;
let last_button;
let calc_operator;
let total;
const box = document.getElementById("box");
const last_operation_history = document.getElementById("last_operation_history");
const equal = document.getElementById("equal_sign").value;
const dot = document.getElementById("dot").value;

const key_combination = [];

function button_number(button) {
    last_button = button;

    if (!operators.includes(button) && button !== equal) {
        if (firstNum) {
            box.innerText = button === dot ? "0" + dot : button;
            firstNum = false;
        } else {
            if (box.innerText.length === 1 && box.innerText === "0") {
                if (button === dot) {
                    box.innerText += button;
                }
                return;
            }
            if (box.innerText.includes(dot) && button === dot) {
                return;
            }
            if (box.innerText.length === 20) {
                return;
            }
            if (button === dot && box.innerText === "-") {
                box.innerText = "-0" + dot;
            } else {
                box.innerText += button;
            }
        }
    } else {
        if (operator_value !== null && button === operator_value) {
            return;
        }
        if (button === "-" && box.innerText == 0) {
            box.innerText = button;
            firstNum = false;
            operator_value = button;
            showSelectedOperator();
            return;
        }
        if (operators.includes(button) && box.innerText === "-") {
            return;
        }
        if (button === "-" && operator_value === "-" && last_operation_history.innerText.includes("=")) {
            return;
        }
        if (operators.includes(button)) {
            calc_operator = typeof last_operator !== "undefined" && last_operator !== null ? last_operator : button;
            last_operator = button === "*" ? "×" : button === "/" ? "÷" : button;
            operator_value = button;
            firstNum = true;
            showSelectedOperator();
        }
        if (numbers.length === 0) {
            numbers.push(box.innerText);
            if (typeof last_operator !== "undefined" && last_operator !== null) {
                last_operation_history.innerText = box.innerText + " " + last_operator;
            }
        } else {
            if (numbers.length === 1) {
                numbers[1] = box.innerText;
            }
            const temp_num = box.innerText;
            if (button === equal && calc_operator !== null) {
                total = calculate(numbers[0], numbers[1], calc_operator);
                box.innerText = total;
                if (!last_operation_history.innerText.includes("=")) {
                    last_operation_history.innerText += " " + numbers[1] + " =";
                }
                temp_num = numbers[0];
                numbers[0] = total;
                operator_value = null;
                showSelectedOperator();
                const history_arr = last_operation_history.innerText.split(" ");
                history_arr[0] = temp_num;
                last_operation_history.innerText = history_arr.join(" ");
            } else if (calc_operator !== null) {
                last_operation_history.innerText = temp_num + " " + last_operator;
                calc_operator = button;
                numbers = [];
                numbers.push(box.innerText);
            }
        }
    }
}

function showSelectedOperator() {
    const elements = document.getElementsByClassName("operator");
    for (const element of elements) {
        element.style.backgroundColor = "#e68a00";
    }
    if (operator_value === "+") {
        document.getElementById("plusOp").style.backgroundColor = "#ffd11a";
    } else if (operator_value === "-") {
        document.getElementById("subOp").style.backgroundColor = "#ffd11a";
    } else if (operator_value === "*") {
        document.getElementById("multiOp").style.backgroundColor = "#ffd11a";
    } else if (operator_value === "/") {
        document.getElementById("divOp").style.backgroundColor = "#ffd11a";
    }
}

function calculate(num1, num2, operator) {
    if (operator === "+") {
        total = parseFloat(num1) + parseFloat(num2);
    } else if (operator === "-") {
        total = parseFloat(num1) - parseFloat(num2);
    } else if (operator === "*") {
        total = parseFloat(num1) * parseFloat(num2);
    } else if (operator === "/") {
        total = parseFloat(num1) / parseFloat(num2);
    } else {
        if (total === box.innerText) {
            return total;
        } else {
            return box.innerText;
        }
    }
    if (!Number.isInteger(total)) {
        total = total.toPrecision(12);
    }
    return parseFloat(total);
}

function button_clear() {
    window.location.reload();
}

function backspace_remove() {
    const last_num = box.innerText.slice(0, -1);
    box.innerText = last_num;
    if (box.innerText.length === 0) {
        box.innerText = 0;
        firstNum = true;
    }
}

function plus_minus() {
    if (operator_value && numbers.length > 0) {
        if (operators.includes(last_button)) {
            if (box.innerText === "-") {
                box.innerText = 0;
                firstNum = true;
                return;
            } else {
                box.innerText = "-";
                firstNum = false;
            }
        } else {
            box.innerText = -box.innerText;
            if (numbers.length === 1) {
                numbers[0] = box.innerText;
            } else {
                numbers[1] = box.innerText;
            }
        }
        return;
    }
    if (box.innerText === 0) {
        box.innerText = "-";
        firstNum = false;
    } else {
        box.innerText = -box.innerText;
    }
}

function square_root() {
    const square_num = Math.sqrt(box.innerText);
    box.innerText = square_num;
    numbers.push(square_num);
}

function division_one() {
    const square_num = 1 / box.innerText;
    box.innerText = square_num;
    numbers.push(square_num);
}

function power_of() {
    const square_num = Math.pow(box.innerText, 2);
    box.innerText = square_num;
    numbers.push(square_num);
}

function calculate_percentage() {
    const elements = document.getElementsByClassName("operator");
    if (numbers.length > 0 && last_operator) {
        if (last_operator === "+" || last_operator === "-") {
            box.innerText = (numbers * box.innerText) / 100;
        } else {
            box.innerText = box.innerText / 100;
        }
    } else {
        box.innerText = box.innerText / 100;
    }
    numbers = [];
    numbers.push(box.innerText);
    for (const element of elements) {
        element.style.backgroundColor = "#e68a00";
    }
}

function clear_entry() {
    if (numbers.length > 0 && last_operator) {
        box.innerText = 0;
        const temp = numbers[0];
        numbers = [];
        numbers.push(temp);
        firstNum = true;
    }
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);

function keyPressed(e) {
    e.preventDefault();
    if (e.key === "Delete") {
        button_clear();
        return;
    }
    const isNumber = isFinite(e.key);
    const enterPress = e.key === "Enter" ? equal : undefined;
    const dotPress = e.key === "." ? dot : undefined;
    const commaPress = e.key === "," ? true : false;
    if (isNumber || operators.includes(e.key) || e.key === enterPress || e.key === dotPress || commaPress || e.key === "Backspace") {
        if (e.key === "Enter") {
            button_number(enterPress);
        } else if (e.key === "Backspace") {
            document.getElementById("backspace_btn").style.backgroundColor = "#999999";
            backspace_remove();
        } else if (commaPress) {
            button_number(dot);
        } else {
            button_number(e.key);
        }
    }
    key_combination[e.code] = e.key;
}

function keyReleased(e) {
    if (key_combination['ControlLeft'] && key_combination['KeyV']) {
        navigator.clipboard.readText().then(text => {
            if (isFinite(text)) {
                const copy_number = text;
                firstNum = true;
                button_number(copy_number);
            }
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    }
    if (key_combination['ControlLeft'] && key_combination['KeyC']) {
        navigator.clipboard.writeText(box.innerText);
    }
    key_combination = [];
    e.preventDefault();
    if (e.key === "Backspace") {
        document.getElementById("backspace_btn").style.backgroundColor = "#666666";
    }
}

