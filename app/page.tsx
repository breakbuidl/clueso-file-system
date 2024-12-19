"use client";

import React, { useState } from 'react';

interface File {
  id: string;
}

interface Folder {
  id: string;
  isOpen: boolean;
  children?: Array<File | Folder>;
}

type Item = File | Folder;

const isFolder = (item: Item): item is Folder => {
  return (item as Folder).isOpen !== undefined;
};

// Helper function to toggle the 'isOpen' state of a folder by its ID
const toggleFolderById = (items: Array<Item>, id: string): Array<Item> => {
  return items.map(item => {
    if (isFolder(item)) {
      if (item.id === id) {
        // Toggle the isOpen state
        return { ...item, isOpen: !item.isOpen };
      }
      if (item.children) {
        // Recursively toggle in children
        return { ...item, children: toggleFolderById(item.children, id) };
      }
    }
    return item;
  });
};

const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span style={{ display: 'inline-block', width: '1em', marginRight: '5px' }}>
    {isOpen ? '▼' : '▶'}
  </span>
);

const FileIcon = () => (
  <span style={{ display: 'inline-block', width: '1em', marginRight: '5px' }}>
    📄
  </span>
);

// Main Component
export default function Home() {
  const [items, setItems] = useState<Array<Item>>([
    { id: 'package.json' },
    { id: 'readme.md'},
    {
      id: 'src',
      isOpen: true,
      children: [
        { id: 'page.tsx' },
        { id: 'layout.tsx' },
        {
          id: 'assets',
          isOpen: true,
          children: [
            { id: 'icon.img' }
          ]
        },
        { id: 'globals.css' }
      ]
    },
  ]);

  const toggleFolder = (id: string) => {
    setItems(prevItems => toggleFolderById(prevItems, id));
  };

  const displayItems = (items: Array<Item>) => {
    return items.map(item => {
      if (isFolder(item)) {
        return (
          <li key={item.id}>
            <div
              onClick={() => toggleFolder(item.id)}
            >
              <ArrowIcon isOpen={item.isOpen} />
              <span>{item.id}</span>
            </div>

            {/* Render children if the folder is open */}
            {item.isOpen && item.children && (
              <ul id={`${item.id}-children`} style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                {displayItems(item.children)}
              </ul>
            )}
          </li>
        );
      } else {
        return (
          <li key={item.id}>
            <div>
              <FileIcon />
              <span>{item.id}</span>
            </div>
          </li>
        );
      }
    });
  };

  return (
    <div>
      <h1>File System</h1>
      <ul style={{ listStyleType: 'none' }}>
        {displayItems(items)}
      </ul>
    </div>
  );
}
