import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ParentElement from './ParentElement.jsx';

const TenderHome = React.lazy(() => import('./../pages/TenderHome.jsx'));
const TenderForm = React.lazy(() => import('./../pages/TenderForm.jsx'));
const TenderDrafts = React.lazy(() => import('./../pages/TenderDrafts.jsx'));
const DraftDetail = React.lazy(() => import('./../pages/DraftDetail.jsx'));
const NewDraftForm = React.lazy(() => import('./../pages/NewDraftForm.jsx'));
const PreviousTender = React.lazy(() => import('./../pages/PreviousTender.jsx'));
const PreviousTenderDetail=React.lazy(() => import('./../pages/PreviousTenderDetail.jsx'));
const PreviousTenderForm=React.lazy(() => import('./../pages/PreviousTenderForm.jsx'));
const ViewDetail=React.lazy(() => import('./../pages/ViewDetail.jsx'));
const AdditionalDocumentForm=React.lazy(() => import('./../pages/AdditionalDocumentForm'));



const router = createBrowserRouter([
  {
    path: '/',
    element: <ParentElement />,
    children: [
      {
        index: true,
        element: <TenderHome />,
      },
      {
        path: 'new-tender',
        element: <TenderForm />,
      },
      {
        path: 'tender/:id',
        element: <TenderDrafts />,
      },
      {
        path: 'new-draft',
        element: <NewDraftForm />,
      },
      {
        path: 'draft/:id',
        element: <DraftDetail />,
      }
      ,
      {
        path: 'previous-tenders',
        element: <PreviousTender />,
      },
      {
        path: 'previous-tender/:id',
        element: <PreviousTenderDetail />,
      },
      {
        path: 'previous-tender-form',
        element: <PreviousTenderForm />,
      }
      ,
      {
        path: 'additional-tender-form',
        element: <AdditionalDocumentForm />,
      }
      ,
      {
        path: 'document-detail/:id',  
        element: <ViewDetail />,
      }
    ],
  },
]);

export default router;
