import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanegesMap from './pages/OrphanegesMap';
import Orphanege from './pages/Orphanage';
import CreateOrphaneges from './pages/CreateOrphanage';

function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Landing} exact />
                <Route path="/app" component={OrphanegesMap} />

                <Route path="/orphanages/create" component={CreateOrphaneges} />
                <Route path="/orphanages/:id" component={Orphanege} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;