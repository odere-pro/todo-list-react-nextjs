import type { Task, TaskType } from '@/types/Task';

export const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const markdown = `# Project Title

## Introduction

This is a brief introduction to the project.

## Features

1. Feature one
2. Feature two
3. Feature three

## Installation

To install the project, follow these steps:

\`\`\`bash
git clone https://github.com/your-repo/project.git
cd project
npm install
\`\`\`

## Usage

- Step one
- Step two
- Step three
`;

export const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

// 1-100%
export const getRandomBoolean = (percentage = 20) => {
    return Math.random() >= 1 - percentage / 100;
};

export const getRandomText = (len: number): string =>
    loremIpsum
        .repeat(getRandomNumber() * 10)
        .trim()
        .slice(0, len);

export const getRandomDate = (start: Date = new Date()): Date => {
    const end = new Date(start.getTime() - 60 * 60 * 1000); // 1 hour ago
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const getRandomType = (): TaskType => {
    const list: TaskType[] = ['todo', 'shopping-item', 'task', 'food'];
    return list[Math.floor(Math.random() * list.length)];
};

// For testing purposes
export const getMockTask = (index: number): Task => {
    const updated = getRandomDate().toISOString();
    const data: Task = {
        locked: getRandomBoolean(5),
        completed: getRandomBoolean(30),
        cost: getRandomNumber() * 100,
        createdAt: updated,
        currency: 'USD',
        data: { 'data 1': getRandomType(), 'data 2': getRandomType() },
        description: markdown,
        parentId: null,
        id: (index + 1).toString().padStart(4, '0'),
        title: getRandomText(120),
        type: getRandomType(),
        updatedAt: updated,
    };

    return data;
};
