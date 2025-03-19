This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.

## Stories

### Done Required

- I as a user can create to-do items, such as a grocery list (**User can click buttons to add, delete, update new items**).
- I as another user can collaborate in real-time with user - so that we can (**long poling**)

### Done

- I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on
things that are still pending. (**There are checkboxes, to mark as done)**
- I as a user can filter the to-do list and view items that were marked as done - so that I
can retrospect on my prior progress. (**User can use search, and filter to hide all finished tasks**)
- I as a user can add sub-tasks to my to-do items - so that I could make logical groups of tasks and see their overall progress. (TODO: Idea to add ann update status bar to see completion, **The user can add infinite number of subtasks and see direct subtasks in cards, use can see one level down and quick summery for convenience and to avoid performance issues**)
- I as a user can specify cost/price for a task or a subtask - so that I can track my
expenses / project cost. (**User can input cost and see also the cost on todo card**)
- I as a user can see the sum of the subtasks aggregated in the parent task - so that in my
shopping list I can see what contributes to the overall sum. For example I can have a
task called “Salad”, where I'd add all ingredients as sub-tasks, and would see how much
a salad costs on my shopping list. (**User can see total cost of all tasks, and subtasks**)
- User can input cost, and see total cost of all tasks, and subtasks (**User can click add subtask infinite amount of times**)
- I as a user can create multiple to-do lists where each list has its unique URL that I can
share with my friends - so that I could have separate to-do lists for my groceries and
work related tasks. (**User can create multiple lists, and share them with friends, and see them in a list of lists with URL - right now every list has own URL by id. TODO replace ID with slug**)

### TODO

- I as a user can be sure that my todos will be persisted so that important information is
not lost when server restarts. (Currently save dat on server in JSON, next steps is connect DB)
- I as an owner/creator of a certain to-do list can freeze/unfreeze a to-do list I've created to avoid other users from mutating it. (Create a session, or any ID to bind with the lock property, so on use tht blocked task/ list could unblock it, as optional approach is also lock when task is edited by the user)

### Skipped

- In addition to regular to-do tasks, I as a user can add “special” typed to-do items, that
will have custom style and some required fields (Down prioritize due to lack of time)
- I as a user can see the cursor and/or selection of another-user as he selects/types when
he is editing text - so that we can discuss focused words during our online call. (Down prioritize due to lack of time)
- I as a user can see the cursor and/or selection of another-user as he selects/types when
he is editing text - so that we can discuss focused words during our online call. (Down prioritize due to lack of time)
- I as a user can keep editing the list even when I lose internet connection, and can
expect it to sync up with BE as I regain connection (Down prioritize due to lack of time)
- I as a user can change the order of tasks via drag & drop (Down prioritize due to lack of time)
- I as a user can move/convert subtasks to tasks via drag & drop (Down prioritize due to lack of time)

### Out of scope

- I as a user can use my VR goggles to edit/browse multiple to-do lists in parallel in 3D
space so that I can feel ultra-productive

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details.
