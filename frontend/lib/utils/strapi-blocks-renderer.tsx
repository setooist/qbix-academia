'use client';

import React from 'react';

export interface TextChild {
    type: 'text';
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
}

export interface LinkChild {
    type: 'link';
    url: string;
    children: TextChild[];
}

export type BlockChild = TextChild | LinkChild;

export interface Block {
    type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code' | 'image';
    level?: number;
    format?: 'ordered' | 'unordered';
    children?: (Block | BlockChild)[];
    image?: {
        url: string;
        alternativeText?: string;
    };
}

/**
 * Renders a single text child with proper formatting (bold, italic, etc.)
 */
function renderTextChild(child: TextChild, index: number): React.ReactNode {
    let content: React.ReactNode = child.text;

    if (child.code) {
        content = <code key={`text-${index}`} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{content}</code>;
    }
    if (child.bold) {
        content = <strong key={`text-${index}`}>{content}</strong>;
    }
    if (child.italic) {
        content = <em key={`text-${index}`}>{content}</em>;
    }
    if (child.underline) {
        content = <u key={`text-${index}`}>{content}</u>;
    }
    if (child.strikethrough) {
        content = <s key={`text-${index}`}>{content}</s>;
    }

    return content;
}

/**
 * Renders children of a block (text, links, etc.)
 */
function renderChildren(children: BlockChild[] | undefined): React.ReactNode {
    if (!children) return null;

    return children.map((child, index) => {
        if (child.type === 'link') {
            // Create a stable key from URL and first text content
            const linkText = child.children?.[0]?.text || '';
            const stableKey = `link-${child.url}-${linkText}`.replaceAll(/\s+/g, '-');
            return (
                <a
                    key={stableKey}
                    href={child.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                >
                    {child.children?.map((c, i) => renderTextChild(c, i))}
                </a>
            );
        }
        // Default: treat as text
        return renderTextChild(child, index);
    });
}

/**
 * Renders list items recursively
 */
function renderListItem(item: Block, index: number): React.ReactNode {
    return (
        <li key={`list-item-${index}`}>
            {renderChildren(item.children as BlockChild[])}
        </li>
    );
}

/**
 * Renders a single Strapi block
 */
function renderBlock(block: Block, index: number): React.ReactNode {
    switch (block.type) {
        case 'heading': {
            const level = block.level || 2;
            const headingClasses: Record<number, string> = {
                1: 'text-4xl font-bold my-6',
                2: 'text-3xl font-bold my-5',
                3: 'text-2xl font-bold my-4',
                4: 'text-xl font-bold my-3',
                5: 'text-lg font-bold my-2',
                6: 'text-base font-bold my-2',
            };
            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
            return (
                <HeadingTag key={`block-${index}`} className={headingClasses[level] || headingClasses[2]}>
                    {renderChildren(block.children as BlockChild[])}
                </HeadingTag>
            );
        }

        case 'list': {
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
            const listClass = block.format === 'ordered'
                ? 'list-decimal pl-6 mb-4 space-y-1'
                : 'list-disc pl-6 mb-4 space-y-1';
            return (
                <ListTag key={`block-${index}`} className={listClass}>
                    {block.children?.map((item, i) => renderListItem(item as Block, i))}
                </ListTag>
            );
        }

        case 'quote':
            return (
                <blockquote key={`block-${index}`} className="border-l-4 border-primary pl-4 italic my-4 text-gray-600">
                    {renderChildren(block.children as BlockChild[])}
                </blockquote>
            );

        case 'code':
            return (
                <pre key={`block-${index}`} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                    <code className="text-sm font-mono">
                        {block.children?.map((c: any) => c.text).join('')}
                    </code>
                </pre>
            );

        case 'image': {
            const image = block.image;
            if (image?.url) {
                return (
                    <figure key={`block-${index}`} className="my-6">
                        <img
                            src={image.url}
                            alt={image.alternativeText || ''}
                            className="rounded-lg w-full"
                        />
                        {image.alternativeText && (
                            <figcaption className="text-center text-sm text-gray-500 mt-2">
                                {image.alternativeText}
                            </figcaption>
                        )}
                    </figure>
                );
            }
            return null;
        }

        case 'paragraph':
        // eslint-disable-next-line no-fallthrough
        default:
            // Render paragraph and unknown block types as paragraphs
            return (
                <p key={`block-${index}`} className="mb-4">
                    {renderChildren(block.children as BlockChild[])}
                </p>
            );
    }
}

/**
 * Props for the StrapiBlocksRenderer component
 */
interface StrapiBlocksRendererProps {
    content: Block[] | string | null | undefined;
}

/**
 * Main component to render Strapi blocks content
 */
export function StrapiBlocksRenderer({ content }: Readonly<StrapiBlocksRendererProps>) {
    if (!content) return null;

    // If content is a string, just return it wrapped in a p tag
    if (typeof content === 'string') {
        return <p>{content}</p>;
    }

    // If content is an array of blocks
    if (Array.isArray(content)) {
        return (
            <div className="strapi-blocks-content">
                {content.map((block, index) => renderBlock(block, index))}
            </div>
        );
    }

    return null;
}

export default StrapiBlocksRenderer;
