import { useEffect, useState } from "react";

const HelloWorldComponent = () => {
    const [text, setText] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/hello-world")
            .then(response => response.text())
            .then(data => setText(data));
    }, []);

    return (
        <p>
            {text}
        </p>
    );
};

export { HelloWorldComponent };