import { React as fix, ElementNode } from 'async-jsx-html';
import { Content } from './Content/Content';
import { Settings } from './Settings/Settings';
const React = fix;

export function App(): ElementNode {
    return (
        <>
            <Settings />
            <Content />
        </>
    );
}
