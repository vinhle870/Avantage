package ProjectContext.managers;

import ProjectContext.dataReader.DataFileReader;
import ProjectContext.dataReader.EnvInfoReader;
import core.assertion.TestAssertions;
import core.enums.driverType;
import core.browser.Browser;


public class TestControl {

    public EnvInfoReader envInfoReader;

    public DataFileReader dataFileReader;
  
  public TestControl() {

      envInfoReader = new EnvInfoReader();

      dataFileReader = new DataFileReader();

      TestAssertions.resetAssertion();

      AppDriverFactory.getInstance().createApplicationDriver(driverType.Selenium);

      Browser.start();
  }

  public EnvInfoReader getEnvInfoReader()
  {
      return envInfoReader;
  }

  public DataFileReader getDataFileReader()
  {
      return dataFileReader;
  }
}
