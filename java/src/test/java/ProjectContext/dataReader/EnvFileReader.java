package ProjectContext.dataReader;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * This is to read the .env file
 * @author vinhle
 *
 */
public class EnvFileReader {
	
	private Dotenv dotenv;
	public EnvFileReader()
	{
		dotenv = Dotenv.configure()
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();
	}
	
	public String getTestSuiteVar()
	{
		return dotenv.get("TESTSUITE");
	}
	public String getEvnVar()
{
	return dotenv.get("ENVNAME");
}
	public String getRemoteUrlVar()
{
	return dotenv.get("REMOTEURL");
}
	public Boolean getIsDockerRunVar()
{
	return Boolean.valueOf(dotenv.get("DOCKERRUN"));
}

	
}
