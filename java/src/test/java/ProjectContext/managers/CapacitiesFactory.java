package ProjectContext.managers;

import core.configuration.browsercapacities.browserCapacities;
import core.configuration.browsercapacities.browserCapacities_Impl;

public class CapacitiesFactory {
	
	browserCapacities browser_cap;

	public static browserCapacities getBrowserCapacitiesReader()
	{
		return new browserCapacities_Impl();
	}

}
