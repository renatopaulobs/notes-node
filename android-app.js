apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-android-extensions'
apply plugin: 'kotlin-kapt'

def getVersionCode = { currentVersionCode ->
    def code = currentVersionCode.toInteger()

    if (project.hasProperty('versionCode')) {
        def tempCode = versionCode.toString().trim()
        if (!tempCode.isEmpty()) {
            code = versionCode.toInteger()
        }
    }

    println "VersionCode is set to $code. If you need an EVOLVED version please build again setting the parameter 'versionCode' greater than the current version, e.g."
    println "   Building current version: gradlew assembleTestGooglePlayRelease -PversionCode=40004000"
    println "   Building evolved version: gradlew assembleTestGooglePlayRelease -PversionCode=40005000"
    return code
}

def getVersionType = { currentVersionType ->
    def type = project.hasProperty('versionType') ? versionType : currentVersionType
    println "VersionType is set to $type. To change the 'versionType' build using -PversionType=<<versionType name>>"
    return type
}

def getVersionFormat = { versionType, versionCode ->
    def versionNameFormat = String.format("%09d", versionCode)

    def major = versionNameFormat.substring(0, 2)
    def minor = versionNameFormat.substring(2, 4)
    def build = versionNameFormat.substring(4, 6)

    if (versionType == "Candidate") {
        versionNameFormat = major + "." + minor + "." + build
    } else {
        def release = versionNameFormat.substring(6, 9).toInteger()
        versionNameFormat = major + "." + minor + "." + build + "." + release
    }

    println "VersionNameFormat is set to $versionNameFormat"

    return versionNameFormat
}

android {
    compileSdkVersion 27
    defaultConfig {
        applicationId "br.org.sidi.technicalreport"
        minSdkVersion 23
        targetSdkVersion 27

        def currentVersionCode = 000100001
        versionCode getVersionCode(currentVersionCode)

        def defaultVersionType = "Internal"
        def versionType = getVersionType(defaultVersionType)

        versionName getVersionFormat(versionType, versionCode)

        project.ext.set("archivesBaseName", "TechnicalReport-" + versionType + "-" + defaultConfig.versionName)

        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            debuggable false
            minifyEnabled false
            defaultConfig.buildConfigField "boolean", "ENABLE_LOGGER", "false"
            defaultConfig.buildConfigField "String", "REPORT_MS_ENDPOINT", "\"http://report.cinprojectscloud.org.br:4000/v1/\""
            defaultConfig.buildConfigField "String", "TECHNICIAN_MS_ENDPOINT", "\"http://report.cinprojectscloud.org.br:5000/v1/\""
            defaultConfig.buildConfigField "String", "SCD_MS_ENDPOINT", "\"https://guo3mn9qy8.execute-api.us-east-2.amazonaws.com/DEV/v1/location/\""
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }

        debug {
            debuggable true
            minifyEnabled false
            defaultConfig.buildConfigField "boolean", "ENABLE_LOGGER", "true"
            defaultConfig.buildConfigField "String", "REPORT_MS_ENDPOINT", "\"http://localhost:4000/v1/\""
            defaultConfig.buildConfigField "String", "TECHNICIAN_MS_ENDPOINT", "\"http://localhost:5000/v1/\""
            defaultConfig.buildConfigField "String", "SCD_MS_ENDPOINT", "\"https://guo3mn9qy8.execute-api.us-east-2.amazonaws.com/DEV/v1/location/\""
        }
    }

    applicationVariants.all { variant ->
        tasks["assemble${variant.name.capitalize()}"].dependsOn += ['copyAllDependencies']

        variant.outputs.each { output ->
            if (variant.getBuildType().isMinifyEnabled()) {
                variant.assemble.doLast {
                    copy {
                        from variant.mappingFile
                        into output.outputFile.parent
                        rename { String fileName ->
                            output.outputFile.getName().take(output.outputFile.getName().lastIndexOf('.')) + ".txt"
                        }
                    }
                }
            }
        }
    }
}

task copyAllDependencies(type: Copy) {
    // The aim of this task is to have all dependencies of the project
    // in a specific folder and so to help the analysis of Open Source.
    from configurations.compile
    into 'all-dependencies'
}

task generator(type: Copy) {
    def generatedFileDir = file("$buildDir/generated/dep")
    outputs.dir generatedFileDir
    doLast {
        generatedFileDir.mkdirs()
        for (int i=0; i<10; i++) {
            new File(generatedFileDir, "${i}.txt").text = i
        }
    }

    from 'all-dependencies'
    into "$buildDir/generated/dep"
}

task unzip(type: Copy) {

    def names = []

    fileTree("$buildDir/generated/aar-dependencies").visit { FileVisitDetails details ->
        names << details.file.name
    }

        def zipFile = file("$buildDir/generated/aar-dependencies/${names[26]}")
        def outputDir = file("$buildDir/generated/unzip/${names[26]}")

        from zipTree(zipFile)
        into outputDir
}

task aarCopy(type: Copy) {

    def aarDir = file("all-dependencies")
    def outputDir = file("$buildDir/generated/aar-dependencies")

    from aarDir
    include "*.aar"
    into outputDir
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"

    // Room dependency
    compile "android.arch.persistence.room:runtime:$archRoomVersion"
    kapt "android.arch.persistence.room:compiler:$archRoomVersion"

    // Lifecycle dependency
    compile "android.arch.lifecycle:extensions:$archLifecycleVersion"
    kapt "android.arch.lifecycle:compiler:$archLifecycleVersion"

    compile "com.android.support:appcompat-v7:$supportLibVersion"
    compile "com.android.support:cardview-v7:$supportLibVersion"
    compile "com.android.support:recyclerview-v7:$supportLibVersion"
    compile "com.android.support:design:$supportLibVersion"
    compile 'com.android.support.constraint:constraint-layout:1.1.0'
    compile 'com.googlecode.libphonenumber:libphonenumber:8.0.1'
    compile 'com.github.ganfra:material-spinner:2.0.0'
    compile 'com.h6ah4i.android.widget.verticalseekbar:verticalseekbar:0.7.2'
    compile 'com.squareup.picasso:picasso:2.71828'
    compile 'com.kyanogen.signatureview:signature-view:1.2'
    compile 'com.squareup.retrofit2:retrofit:2.4.0'
    compile 'com.squareup.retrofit2:converter-moshi:2.4.0'
    compile 'com.squareup.moshi:moshi:1.6.0'
    compile 'com.theartofdev.edmodo:android-image-cropper:2.7.0'
    compile 'org.jetbrains.anko:anko:0.10.5'
    compile 'org.jetbrains.anko:anko-commons:0.10.5'
    compile 'org.jetbrains.anko:anko-design:0.10.5'
    compile 'com.facebook.stetho:stetho:1.5.0'
    compile group: 'org.apache.commons', name: 'commons-lang3', version: '3.7'
    compile group: 'org.apache.httpcomponents', name: 'httpcore', version: '4.4.9'
    compile group: 'commons-validator', name: 'commons-validator', version: '1.5.0'
    compile group: 'commons-io', name: 'commons-io', version: '2.6'

    kapt 'com.squareup.moshi:moshi-kotlin-codegen:1.6.0'

    testCompile 'junit:junit:4.12'
    androidTestCompile 'com.android.support.test:runner:1.0.2'
    androidTestCompile 'com.android.support.test.espresso:espresso-core:3.0.2'

    debugCompile 'com.facebook.stetho:stetho:1.4.2'
}
kotlin {
    experimental {
        coroutines "enable"
    }
}
