import { React as fix, ElementNode } from 'async-jsx-html';

const React = fix;

export function Content(): ElementNode {
    return (
        <div>
            <textarea id="content"></textarea>
            <button id="save-content">Save</button>
        </div>
    );
}
