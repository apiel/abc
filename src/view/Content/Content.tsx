import { React as fix, ElementNode } from 'async-jsx-html';

const React = fix;

export function Content(): ElementNode {
    return (
        <div>
            <div>
                <textarea id="content"></textarea>
            </div>
            <div>
                <button id="save-content">Save</button>
            </div>
        </div>
    );
}
