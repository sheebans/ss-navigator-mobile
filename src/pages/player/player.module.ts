import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerPage } from './player';
import { ComponentsModule } from '@components/components.module';
import { PipesModule } from '@pipes/pipes.module';
import { ClassesProvider } from '@providers/api/core/classes';
import { CoursesProvider } from '@providers/api/core/courses';

@NgModule({
  declarations: [PlayerPage],
  imports: [
    IonicPageModule.forChild(PlayerPage),
    ComponentsModule,
    PipesModule
  ],
  providers: [ClassesProvider, CoursesProvider]
})
export class PlayerPageModule {}
