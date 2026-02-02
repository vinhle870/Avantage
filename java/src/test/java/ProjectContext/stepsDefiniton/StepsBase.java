/**
 *
 */
package ProjectContext.stepsDefiniton;

import ProjectContext.dataReader.EnvInfoReader;
import ProjectContext.managers.TestControl;


public class StepsBase {
  
  public TestControl testControl;
  public EnvInfoReader envInfoReader;
  
  public void InitObject(TestControl testControl) {
    this.testControl = testControl;

    this.envInfoReader = testControl.getEnvInfoReader();
  }

}
