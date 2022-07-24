cd /app
chmod +x mysed
./mysed replace -o ==foVH2IHeofDf249fND36fhuirIOFru27dHFD== -n $PRO_BASE_URL
./mysed replace -o ==foVH2IHeofDf249MAPAIHOUTAIUPLOADfND3== -n $PRO_UPLOAD_URL
./mysed replace -o ==foVH2IHeofDf324fH526fhuirIOFru27dHFD== -n $PRO_H5_URL
./mysed replace -o ==foVH2IHeofDf333fH526fminiIOFru17dHFD== -n $PRO_MINI_PROGRAM_URL
./mysed replace -o ==prVH2IHeofDf247APPUPLOADTAPROCESSfND== -n $PRO_BASE_PROCESS
nginx -g 'daemon off;'
