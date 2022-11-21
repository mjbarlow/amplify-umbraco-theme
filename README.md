# PROJECT IS ARCHIVED

# Amplify Theme for Umbraco 8
Amplify is the open source and extendable theme that will get you started with Umbraco in minutes.  
The theme is now available under the MIT licence, and is open for collaboration. 

<a href='https://ko-fi.com/mattbarlow' target='_blank'>
  <img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />
</a>
<br/><br/>

**Login:**
admin@admin.com 

**Pass:**
1234567890

  
![Amplify Theme](/amplify-theme-umbrco.png)

### Amplify Theme Key Features

- Supports Umbraco 8.9+
- Blocklist editor (no nested content)
- Easy theme creation and assignment
- SASS compiler included
- 2 preset themes included (Amplify & Paragon)
- 10+ page types
- 20+ content block types
- Site search
- Site maps 
- Completely responsive
- Built with Bulma and Vue frameworks 
<br/><br/>

**Important info for using your own models**

To use your own models, add Umbraco.ModelsBuilder and Umbraco.ModelsBuilder.UI via nuget. Then build the solution.

Change the modelsbuilder mode In the web.config to: 
<br/><br/>

```
<add key="Umbraco.ModelsBuilder.Enable" value="true" />
<add key="Umbraco.ModelsBuilder.ModelsMode" value="Dll" />
```

Then in the umbraco backoffice go to settings > Modelsbuilder and click build models.
<br/><br/>




