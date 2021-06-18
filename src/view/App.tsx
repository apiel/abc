import { React as fix, ElementNode } from 'async-jsx-html';
import { Settings } from './Settings/Settings';
const React = fix;

export function App(): ElementNode {
    return (
        <>
            <Settings />
        </>
    );
}
